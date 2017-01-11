package syra.etl.app.model;

import java.io.Serializable;

@SuppressWarnings("serial")
public class ScheduleKey implements Serializable{

	String jobName;
	String triggerName;

	public ScheduleKey(String jobName, String triggerName){
		 this.jobName = jobName;
		 this.triggerName = triggerName;
	}
	
	public String getTriggerName(){
		return triggerName;
	}
	
	public String getJobName(){
		return jobName;
	}
}