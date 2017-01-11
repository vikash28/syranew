package syra.etl.app.scheduler;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.ServletContext;

import org.json.JSONArray;
import org.json.JSONObject;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.PersistJobDataAfterExecution;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger.TriggerState;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;

//import com.amazonaws.AmazonClientException;
//import com.amazonaws.AmazonServiceException;
//import com.amazonaws.services.s3.AmazonS3;
//import com.amazonaws.services.s3.model.AmazonS3Exception;
//import com.amazonaws.services.s3.model.ObjectMetadata;

import syra.etl.app.dao.MappingsViewRepository;
import syra.etl.app.model.MappingsView;

@PersistJobDataAfterExecution
@DisallowConcurrentExecution
public class SyraSchedulerJob extends QuartzJobBean implements Comparator<JSONObject> {
    
	Logger LOGGER = LoggerFactory.getLogger(SyraSchedulerJob.class);
	
    @Autowired
    private MappingsViewRepository mappingsviewRepository;	

    @Autowired
    private ServletContext servletContext;	
	
    protected void executeInternal(JobExecutionContext ctx) throws JobExecutionException {

    	//Get Base URL of the backend app
    	String baseUrl = servletContext.getInitParameter("baseUrl");
    	//String baseUrl = "http://etl.syra.io/Syra-1.0.0-BUILD-SNAPSHOT";
    	
		String fireInstanceId = ctx.getFireInstanceId();
		
		String jobName = ctx.getJobDetail().getKey().getName();
		String triggerName = ctx.getTrigger().getKey().getName();
    	//JobDataMap dataMap = ctx.getJobDetail().getJobDataMap();
    	JobDataMap dataMap = ctx.getMergedJobDataMap();
		
		// Check if the task is a Workflow child !!
		if(dataMap.get("wfTriggerName")!=null && 
			!dataMap.getString("wfTriggerName").trim().equals("") &&
			!dataMap.getString("wfTriggerName").trim().equalsIgnoreCase("null")){
			
			// Update triggerName to set the Workflow trigger name !!
			triggerName = dataMap.getString("wfTriggerName");
		}
		
		LOGGER.info("Running schedule: " + triggerName, fireInstanceId, jobName, triggerName, "start");
		
    	Long mappingId = dataMap.getLong("mappingId");
		
		// Check if the original Mapping exist !!
		MappingsView mapping = mappingsviewRepository.findMappingsViewById(mappingId);
		
		if(mapping == null){
			LOGGER.warn("WARNING!! Mapping for [" + jobName + "] does not exist, unable to run this schedule! Pausing the trigger", fireInstanceId, jobName, triggerName);
			
			try{
				ctx.getScheduler().pauseTrigger(ctx.getTrigger().getKey());
			} catch(SchedulerException ex){
				LOGGER.error(ex.getMessage(), fireInstanceId, jobName, triggerName);
				ex.printStackTrace();
			}
			return;
		}
		
		// Check if pre-check is set and file exists
		// Continue execution only if it's set and file exist
		if(dataMap.getString("jobData") != null){
			JSONObject jsonObject = new JSONObject(dataMap.getString("jobData"));
			if(jsonObject.has("triggerPrecheckFile") 
					&& !jsonObject.getString("triggerPrecheckFile").trim().equals("")){
				
				String triggerPrecheckFile = jsonObject.getString("triggerPrecheckFile");
				
				if(!new java.io.File(triggerPrecheckFile).exists()){
					LOGGER.info("Trigger file not found, skipping the execution", fireInstanceId, jobName, triggerName, "result");
					return;
				}
			}
		}

		// Start the Scheduled Job Exeuction from here!!

		String sMappings = mapping.getMappings().replaceAll("\\\\n","");
		
		// Retrieve and Loop through all individual mappings JSON Objects !!
		JSONArray jsonArray = new JSONArray(sMappings);
		boolean overallSuccessFlag = true;
		
		for(int mappingIndex=0; mappingIndex<jsonArray.length(); mappingIndex++){
			boolean successFlag = false;
			
			JSONObject jsonData = jsonArray.getJSONObject(mappingIndex);
					
			String mappingRules = null;
			
			try{
				mappingRules = jsonData.getString("mappingrules");
			} catch(Exception ex){}
						
			if(mapping.getSourceConnectionType().equals("Hive")
					&& mapping.getTargetConnectionType().equals("Redshift")){
			
				// Check if it's a Table or Column migration!
				// ColMigration will have mappingrules property !!
				if(mappingRules!=null && !mappingRules.trim().equals("")){
				
					LOGGER.info("Hive to Redshift Column Mappings", fireInstanceId, jobName, triggerName, "type");
					successFlag = runMigrate(baseUrl + "/HiveToRedshiftMapping", jsonData, fireInstanceId, jobName, triggerName);
				
				} else {
				
					LOGGER.info("Hive to Redshift Table Mappings", fireInstanceId, jobName, triggerName, "type");
					successFlag = runMigrate(baseUrl + "/HiveToRedshift", jsonData, fireInstanceId, jobName, triggerName);
				
				}
			} else if(mapping.getSourceConnectionType().equals("Hive")
					&& mapping.getTargetConnectionType().equals("Hive")){
			
				// Check if it's a Table or Column migration!
				// ColMigration will have mappingrules property !!
				if(mappingRules!=null && !mappingRules.trim().equals("")){
				
					LOGGER.info("Hive to Hive Column Mappings", fireInstanceId, jobName, triggerName, "type");
					successFlag = runMigrate(baseUrl + "/HiveToHive", jsonData, fireInstanceId, jobName, triggerName);
				
				} else {
				
					LOGGER.info("Hive to Hive Table Mappings", fireInstanceId, jobName, triggerName, "type");
					successFlag = runMigrate(baseUrl + "/HiveToHive", jsonData, fireInstanceId, jobName, triggerName);
				
				}
			} else if (mapping.getSourceConnectionType().equals("HDFS")
					&& mapping.getTargetConnectionType().equals("Redshift")){
				
				LOGGER.info("HDFS to Redshift", fireInstanceId, jobName, triggerName, "type");
				successFlag = runMigrate(baseUrl + "/HdfsToRedshift", jsonData, fireInstanceId, jobName, triggerName);
				
			} else if (mapping.getSourceConnectionType().equals("Local")
					&& mapping.getTargetConnectionType().equals("Redshift")){
				
				LOGGER.info("Local to Redshift", fireInstanceId, jobName, triggerName, "type");
				
				/*String accessKey = "AKIAIRGK737VJCTD4PDA";
				String secretKey = "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";
	
				AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
				AmazonS3 conn = new AmazonS3Client(credentials);
				
				AmazonS3URI s3FileUri = new AmazonS3URI(jsonData.getString("localS3FilePath"));
				
				boolean flagFileExists = false;
				
				// Loop through every 30 mins to see if the file exists !!
				for(int i=0; i<48; i++){
					flagFileExists = isValidFile(conn, s3FileUri.getBucket(), s3FileUri.getKey(), 
													fireInstanceId, jobName, triggerName);
												
					if(!flagFileExists){
						LOGGER.info("File does not exist", fireInstanceId, jobName, triggerName, "result");
						System.out.println("File does not exist, sleeping..");
						
						try{
							// Sleep for 30 mins !!
							Thread.sleep(15 * 1000);
						} catch(InterruptedException iEx){
							LOGGER.error(iEx.toString(), fireInstanceId, jobName, triggerName, "result");
							return;
						}
					} else {
						// File found, continue execution !!
						break;
					}
				}
				
				// Do not execute the Job if File is not found !!
				if(!flagFileExists){
					return;
				}*/
				
				successFlag = runMigrate(baseUrl + "/LocalToRedshift", jsonData, fireInstanceId, jobName, triggerName);
			}
			
			// Update overallSuccessFlag if any of the Migrations failed
			if(successFlag == false){
				overallSuccessFlag = successFlag;
			}
		}

		/* Run related Workflow jobs */
		String relatedMappings = dataMap.getString("relatedMappings");
		if(relatedMappings!=null && !relatedMappings.equalsIgnoreCase("null")){
			JSONArray jsonArrayRelatedMappings = new JSONArray(relatedMappings);
			
			// Execute Workflow jobs by priority
			List<JSONObject> wfList = new ArrayList<JSONObject>();
			
			for (int i = 0; i < jsonArrayRelatedMappings.length(); i++){
			   wfList.add(jsonArrayRelatedMappings.getJSONObject(i));
			}

			// Sort the Collection by Priority
			Collections.sort(wfList, this);
			
			// Iterate the sorted workflow and execute Jobs one-by-one
						
			for(int i=0; i<wfList.size(); i++){
				JSONObject wfTask = wfList.get(i);
				
				String wfJobName = wfTask.getString("wfJobName");
				String wfTriggerName = wfTask.getString("wfTriggerName");
				int wfPriority = wfTask.getInt("wfPriority");
				boolean wfParentExec = wfTask.getBoolean("wfParentExec");
				
				if(!wfParentExec || (wfParentExec && overallSuccessFlag)){				
					try{
						Scheduler scheduler = ctx.getScheduler();
						// Check if the Trigger which created this workflow exists and NOT paused by the user !!
						// TODO - need to clean up Parent Job's job data if we delete a trigger
						
						TriggerKey triggerKey = new TriggerKey(wfTriggerName, "syra");
						if(scheduler.checkExists(triggerKey) && 
							scheduler.getTriggerState(triggerKey) != TriggerState.PAUSED){
						
							LOGGER.info("Executing Workflow Job - " + wfJobName + "[" + wfPriority + "]", fireInstanceId, jobName, triggerName, "workflow");
						
							// Get the child Job
							JobDetail childJob = scheduler.getJobDetail(new JobKey(wfJobName, "syra"));
							JobDataMap childJobDataMap = childJob.getJobDataMap();
							
							// Add workflow info for this execution
							childJobDataMap.put("wfJobName", wfJobName);
							childJobDataMap.put("wfTriggerName", wfTriggerName);
							childJobDataMap.put("wfPriority", wfPriority);
							childJobDataMap.put("wfParentExec", wfParentExec);
							childJobDataMap.put("wfParentJobName", jobName);
							childJobDataMap.put("wfParentTriggerName", triggerName);
							childJobDataMap.put("wfParentExecResult", overallSuccessFlag);
							childJobDataMap.put("wfFireInstanceId", fireInstanceId);
							
							// Execute the Workflow / child job !!
							scheduler.triggerJob(childJob.getKey(), childJobDataMap);
							
						}
					} catch(SchedulerException ex){
						LOGGER.error(ex.getMessage(), fireInstanceId, jobName, triggerName);
						ex.printStackTrace();
					}
				}

			}
		}
		
		/* End related Workflow jobs */
    }
	
	public boolean runMigrate(String url, JSONObject currentMapping, String fireInstanceId, String jobName, String triggerName){
		try
		{			
			HttpURLConnection httpcon = (HttpURLConnection) ((new URL(url).openConnection()));
			httpcon.setDoOutput(true);
			httpcon.setRequestProperty("Content-Type", "application/json");
			httpcon.setRequestProperty("Accept", "application/json");
			httpcon.setRequestMethod("POST");
			httpcon.connect();

			byte[] outputBytes = currentMapping.toString().getBytes("UTF-8");
			OutputStream os = httpcon.getOutputStream();
			os.write(outputBytes);
			os.flush();
			os.close();
			
			InputStream err = httpcon.getErrorStream();			
			if(err==null){
				BufferedReader br = new BufferedReader(new InputStreamReader(httpcon.getInputStream()));
				String s = null;
				while((s=br.readLine())!=null){
					LOGGER.info(s, fireInstanceId, jobName, triggerName, "result");
				}
				
				// Make successFlag true only if success response from server !!
				
				return true;
			} else {
				BufferedReader br2 = new BufferedReader(new InputStreamReader(err));
				String s2 = null;
				while((s2=br2.readLine())!=null){
					LOGGER.info(s2, fireInstanceId, jobName, triggerName, "result");
				}

				// return false if Server returned an error
				return false;
			}
		} catch(Exception ex){
			LOGGER.error(ex.toString(), fireInstanceId, jobName, triggerName, "result");
			ex.printStackTrace();
		}
		
		// Return successFlag = false
		return false;
	}

//	public boolean isValidFile(AmazonS3 s3, String bucketName, String path, 
//					String fireInstanceId, String jobName, String triggerName) 
//					throws AmazonClientException, AmazonServiceException {
//		boolean isValidFile = true;
//		try {
//			@SuppressWarnings("unused")
//			ObjectMetadata objectMetadata = s3.getObjectMetadata(bucketName, path);
//		} catch (AmazonS3Exception s3e) {
//			if (s3e.getStatusCode() == 404) {
//			// i.e. 404: NoSuchKey - The specified key does not exist
//				isValidFile = false;
//			}
//			else {
//				LOGGER.error(s3e.toString(), fireInstanceId, jobName, triggerName, "result");
//				throw s3e;    // rethrow all S3 exceptions other than 404   
//			}
//		}
//
//		return isValidFile;
//	}	
	
	@Override
    public int compare(JSONObject a, JSONObject b)
    {
        //valA and valB could be any simple type, such as number, string, whatever
        int valA = a.getInt("wfPriority");
        int valB = b.getInt("wfPriority");

        if(valA > valB){
			return 1;
		}
		
        if(valA < valB){
			return -1;
		}
        
		return 0;    
    }
	
}