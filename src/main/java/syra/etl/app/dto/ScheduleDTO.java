package syra.etl.app.dto;


import java.sql.Blob;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.quartz.CronExpression;
import org.quartz.JobDataMap;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import net.redhogs.cronparser.format.CronExpressionFormatter;
import syra.etl.app.dto.serialization.CustomJobDataMapDeserializer;
import syra.etl.app.dto.serialization.CustomJobDataMapSerializer;
import syra.etl.app.model.Schedule;

/**
 *
 * JSON serializable DTO containing Schedule data
 *
 */
public class ScheduleDTO {

	private String jobName;
	private String triggerName;
	private String cron;
	private String startAt;
	private String endAt;
	private String triggerState;

	private Blob jobData;

    @JsonSerialize(using = CustomJobDataMapSerializer.class)
    @JsonDeserialize(using = CustomJobDataMapDeserializer.class)	
	private JobDataMap jobDataEx;

	private CronExpressionFormatter p = new CronExpressionFormatter();
	private SimpleDateFormat parserSDF = new SimpleDateFormat("dd MMMM yyyy HH:mm Z");
	
    public ScheduleDTO() {
    }
	
	public ScheduleDTO(String jobName, String triggerName, String cron, String startAt, String endAt, 
				Blob jobData, String triggerState) {
		this.jobName = jobName;
		this.triggerName = triggerName;
		this.cron = cron;
		this.startAt = startAt;
		this.endAt = endAt;
		
		this.jobData = jobData;
		
		this.triggerState = triggerState;
	}	

    public static ScheduleDTO mapFromScheduleEntity(Schedule schedule) {
        return new ScheduleDTO(schedule.getJobName(), schedule.getTriggerName(), schedule.getCron(), 
						schedule.getStartAt(), schedule.getEndAt(), schedule.getJobData(), 
						schedule.getTriggerState());
    }

    public static List<ScheduleDTO> mapFromSchedulesEntities(List<Schedule> schedules) {
        return schedules.stream().map((schedule) -> mapFromScheduleEntity(schedule)).collect(Collectors.toList());
    }

	public void setJobName(String jobName) {
		this.jobName = jobName;
	}

	public String getJobName() {
		return jobName;
	}

	public void setTriggerName(String triggerName) {
		this.triggerName = triggerName;
	}

	public String getTriggerName() {
		return triggerName;
	}

	public void setCron(String cron) {
		this.cron = cron;
	}

	public String getCron() {
		return cron;
	}

	public String getCronEx() {
		try{
			CronExpression cronEx = new CronExpression(cron);
			return p.print(cronEx, Locale.US).replaceAll(", every year","");
		}catch(Exception ex){}
		
		return "";
	}

	public void setStartAt(String startAt) {
		this.startAt = startAt;
	}

	public String getStartAt() {
		return startAt;
	}

	public String getStartAtEx() {
		if(startAt == null || startAt.trim().equals("") || startAt.trim().equals("0")){
			return "";
		} else {
			try{
				return parserSDF.format(new Date(Long.parseLong(startAt)));
			}catch(Exception ex){}
			
			return "";
		}
	}
	
	public void setEndAt(String endAt) {
		this.endAt = endAt;
	}

	public String getEndAt() {
		return endAt;
	}

	public String getEndAtEx() {
		if(endAt == null || endAt.trim().equals("") || endAt.trim().equals("0")){
			return "";
		} else {
			try{
				return parserSDF.format(new Date(Long.parseLong(endAt)));
			}catch(Exception ex){}
			
			return "";		
		}
	}
	
	public void setJobData(Blob jobData) {
		this.jobData = jobData;
	}

	
	public JobDataMap getJobDataEx() {
		try{
			if(jobDataEx != null){
				return jobDataEx;
			}
			else if(jobData != null && jobData.length()>1){
				java.io.ObjectInputStream objectIn = new java.io.ObjectInputStream(jobData.getBinaryStream());

				Object deSerializedObject = objectIn.readObject();
			
				JobDataMap jobDataMap = (JobDataMap) deSerializedObject;
				
				return jobDataMap;
			}
		} catch (Exception ex){
			ex.printStackTrace();
		}
			
		return null;
	}

	public void setTriggerState(String triggerState) {
		this.triggerState = triggerState;
	}

	public String getTriggerState() {
		return triggerState;
	}

}
