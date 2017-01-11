package syra.etl.app.services;


import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;
import static org.springframework.util.Assert.notNull;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.quartz.CronTrigger;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import syra.etl.app.dao.ScheduleRepository;
import syra.etl.app.dto.ScheduleDTO;
import syra.etl.app.model.Schedule;
import syra.etl.app.model.SearchResult;
import syra.etl.app.scheduler.SyraSchedulerJob;

/**
 *
 * Business service for Schedule-related operations.
 *
 */
@Service
public class ScheduleService {

    @SuppressWarnings("unused")
	private static final Logger LOGGER = LoggerFactory.getLogger(ScheduleService.class);
	
	private SimpleDateFormat parserSDF = new SimpleDateFormat("dd MMMM yyyy HH:mm");
	
	@Autowired
	private SchedulerFactoryBean schedulerFactoryBean;

    @Autowired
    private ScheduleRepository scheduleRepository;

    /**
     *
     * searches schedules by date/time
     *
     * @param jobname - the currently logged in user
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public SearchResult<Schedule> findSchedules(String jobname) {

        Long resultsCount = scheduleRepository.countSchedules(jobname);

        List<Schedule> schedules = scheduleRepository.findSchedules(jobname);

        return new SearchResult<>(resultsCount, schedules);
    }

    /**
     *
     * Pauses trigger by name
     *
     * @param triggerName - the currently logged in user
     * @return - the found results
     */
    @Transactional(readOnly = false)
    public SearchResult<Schedule> pauseSchedule(String triggerName) {
        notNull(triggerName, "triggerName is mandatory");

		try{
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			scheduler.pauseTrigger(new TriggerKey(triggerName, "syra"));
		} catch (SchedulerException ex) {
			throw new RuntimeException(ex);
		} 			

        List<Schedule> schedules = scheduleRepository.findTrigger(triggerName);

        return new SearchResult<>(schedules.size(), schedules);
    }	

    /**
     *
     * Resumes trigger by name
     *
     * @param triggerName - the currently logged in user
     * @return - the found results
     */
    @Transactional(readOnly = false)
    public SearchResult<Schedule> resumeSchedule(String triggerName) {
        notNull(triggerName, "triggerName is mandatory");

		try{
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			scheduler.resumeTrigger(new TriggerKey(triggerName, "syra"));
		} catch (SchedulerException ex) {
			throw new RuntimeException(ex);
		} 			

        List<Schedule> schedules = scheduleRepository.findTrigger(triggerName);

        return new SearchResult<>(schedules.size(), schedules);
    }	

	/**
     *
     * Unschedules trigger by name
     *
     * @param triggerName - the currently logged in user
     * @return - the found results
     */
    @Transactional(readOnly = false)
    public boolean deleteSchedule(String triggerName) {
        notNull(triggerName, "triggerName is mandatory");

		try{
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			return scheduler.unscheduleJob(new TriggerKey(triggerName, "syra"));
		} catch (SchedulerException ex) {
			throw new RuntimeException(ex);
		}
    }	
	
    /**
     *
     * deletes a list of schedules, given their Ids
     *
     * @param deletedScheduleIds - the list of schedules to delete
     */
    @Transactional
    public void deleteSchedules(List<Long> deletedScheduleIds) {
        notNull(deletedScheduleIds, "deletedSchedulesId is mandatory");
        deletedScheduleIds.stream().forEach((deletedScheduleId) -> scheduleRepository.delete(deletedScheduleId));
    }

    /**
     *
     * saves a schedule (new or not) into the database.
     *
     * @param jobname - - the currently logged in user
     * @param id - the database ud of the schedule
     * @return - the new version of the schedule
     */

    @Transactional
    public Schedule saveSchedule(String jobName, String triggerName, String cron, String startAt, String endAt, 
						JobDataMap jobDataEx) {

        notNull(jobName, "jobName is mandatory");
        notNull(triggerName, "triggerName is mandatory");
		
		boolean wfTrigger = false;
		if(jobDataEx == null){
			notNull(cron, "cron is mandatory");
		} else {
			notNull(jobDataEx, "jobDataEx is mandatory");

			// TODO - checking for Precheck file
			// Need to align code with the rest of impl
			
			String wfJobData = jobDataEx.getString("jobData");
			JSONObject wfJsonData = new JSONObject(wfJobData);
			if(wfJsonData.has("wfParent")){
				wfTrigger = true;
			}
		}
		
        Schedule schedule = new Schedule();
		schedule.setJobName(jobName);
		schedule.setTriggerName(triggerName);
		schedule.setCron(cron);
		schedule.setStartAt(startAt);
		schedule.setEndAt(endAt);
		//schedule.setJobDataEx(jobDataEx);

		try{
			Scheduler scheduler = schedulerFactoryBean.getScheduler();
			boolean flagNewJob = false;
			JobDetail jobDetail = scheduler.getJobDetail(new JobKey(jobName, "syra"));
			Trigger trigger = scheduler.getTrigger(new TriggerKey(triggerName, "syra"));
					
			if(jobDetail != null && trigger != null){

				// Do nothing if Job / Trigger already exists !!
				
			} else {
			
				// Check if Quartz Job for the Mapping exist
				if(jobDetail == null){
					flagNewJob = true;
					
					// Store/Create jobs Durably so it can exist even if there is no Trigger attached !!
					
					Long mappingId = Long.parseLong(jobName.substring(jobName.lastIndexOf(":::#")+4));
					
					JobDataMap jobDataMap = new JobDataMap();
					jobDataMap.putAsString("mappingId", mappingId);
					
					jobDetail = newJob(SyraSchedulerJob.class)
						.usingJobData(jobDataMap)
						.withIdentity(jobName, "syra")
						.storeDurably(true)
						.build();
					
					// Create new Schedule Job
					scheduler.addJob(jobDetail, true);
						
				}
								
				// Check if the Job wasn't created already and no Trigger with the name exist
				if(flagNewJob || trigger == null){
				
					// Create CRON trigger if it's not a Workflow task !!
					if(!wfTrigger){
				
						TriggerBuilder<CronTrigger> triggerBuilder = newTrigger()
									.withIdentity(triggerName, "syra")
									.withSchedule(cronSchedule(cron))
									.usingJobData(jobDataEx)
									.forJob(jobDetail);

						// Set Start time
						if(startAt != null && !startAt.trim().equals("")){
							triggerBuilder.startAt(parserSDF.parse(startAt));
						}
						
						// Set End time
						if(endAt != null && !endAt.trim().equals("")){
							triggerBuilder.endAt(parserSDF.parse(endAt));
						}
						
						trigger = triggerBuilder.build();
						
					} else {
						// CRON EXP that never fires in next 100 years !!
						String exp = "0 0 0 1 1 ? *";
						String startDate = "31 December 2099 23:55";
						
						//JobDataMap jobDataMap = new JobDataMap();
						//jobDataMap.put("jobData", jobData);
						
						TriggerBuilder<CronTrigger> triggerBuilder = newTrigger()
									.withIdentity(triggerName, "syra")
									.withSchedule(cronSchedule(exp))
									.startAt(parserSDF.parse(startDate))
									.usingJobData(jobDataEx)
									.forJob(jobDetail);

						trigger = triggerBuilder.build();
						
						// Add related mappings to the Job!!
						// Extract Workflow data
						String wfJobData = jobDataEx.getString("jobData");
						JSONObject wfJsonData = new JSONObject(wfJobData);
						String wfParent = wfJsonData.getString("wfParent");
						
						// Get the parent job
						JobDetail parentJobDetail = scheduler.getJobDetail(new JobKey(wfParent, "syra"));
						JobDataMap parentJobDataMap = null;
						
						if(parentJobDetail == null){
							Long mappingId = Long.parseLong(wfParent.substring(wfParent.lastIndexOf(":::#")+4));
							
							parentJobDataMap = new JobDataMap();
							parentJobDataMap.putAsString("mappingId", mappingId);
						
							parentJobDetail = newJob(SyraSchedulerJob.class)
												.usingJobData(parentJobDataMap)
												.withIdentity(wfParent, "syra")
												.storeDurably(true)
												.build();
						} else {
							// Get related mappings
							parentJobDataMap = parentJobDetail.getJobDataMap();
						}
						
						String relatedMappings = parentJobDataMap.getString("relatedMappings");
						JSONArray jsonArray;

						// Add this trigger!!
						if(relatedMappings == null || relatedMappings.equalsIgnoreCase("null")){
							jsonArray = new JSONArray();
						} else {
							jsonArray = new JSONArray(relatedMappings);
						}
						
						jsonArray.put(wfJsonData);
						parentJobDataMap.put("relatedMappings", jsonArray.toString());
						
						// Set the updated relatedMappings back to parent!!
						JobDetail newParentJobDetail = parentJobDetail.getJobBuilder()
																		.setJobData(parentJobDataMap)
																		.build();
						
						// Update scheduler / database !!
						scheduler.addJob(newParentJobDetail, true);
						
						// TODO - Remove?? / Orphants? 
					}

					scheduler.scheduleJob(trigger);
					
				}

			}
		} catch (SchedulerException ex) {
			throw new RuntimeException(ex);
		} catch (ParseException pEx) {
			throw new RuntimeException(pEx);
		}			

        return schedule;
    }

    /**
     *
     * saves a list of schedules (new or not) into the database
     *
     * @param schedules - the list of schedules to be saved
     * @return - the new versions of the saved schedules
     */
    @Transactional
    public List<Schedule> saveSchedules(List<ScheduleDTO> schedules)  {
        return schedules.stream()
                .map((schedule) -> saveSchedule(schedule.getJobName(),
						schedule.getTriggerName(),
						schedule.getCron(),
						schedule.getStartAt(),
						schedule.getEndAt(),
						schedule.getJobDataEx()))
                .collect(Collectors.toList());
    }
}
