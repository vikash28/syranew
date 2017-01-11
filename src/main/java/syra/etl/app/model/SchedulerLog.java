package syra.etl.app.model;


import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.hibernate.annotations.Synchronize;

/**
 *
 * The SchedulerLog JPA entity
 *
 */
@SuppressWarnings("serial")
@Entity
@Immutable
@Subselect("SELECT * FROM schedulerlog")
@Synchronize("schedulerlog")
public class SchedulerLog implements Serializable {

	@Id
	private String fireInstanceId;
	
	private String jobName;
	private String triggerName;
	private String levelString;
	private String timestmp;
	private String startMsg;
	private String typeMsg;	
	private String resultMsg;

	public SchedulerLog(){
	}
	
	public SchedulerLog(String fireInstanceId, String jobName, String triggerName, 
			String levelString, String timestmp, String startMsg, String typeMsg, String resultMsg) {
		super();
		this.fireInstanceId = fireInstanceId;
		this.jobName = jobName;
		this.triggerName = triggerName;
		this.levelString = levelString;
		this.timestmp = timestmp;
		this.startMsg = startMsg;
		this.typeMsg = typeMsg;
		this.resultMsg = resultMsg;
	}

	public String getFireInstanceId() {
		return fireInstanceId;
	}

	public String getJobName() {
		return jobName;
	}
	
	public String getTriggerName() {
		return triggerName;
	}
	
	public String getLevelString() {
		return levelString;
	}

	public String getTimestmp() {
		return timestmp;
	}

	public String getStartMsg() {
		return startMsg;
	}

	public String getTypeMsg() {
		return typeMsg;
	}

	public String getResultMsg() {
		return resultMsg;
	}
	
}
