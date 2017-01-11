package syra.etl.app.model;


import java.io.Serializable;
import java.sql.Blob;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.hibernate.annotations.Synchronize;

/**
 *
 * The Schedule JPA entity
 *
 */
@SuppressWarnings("serial")
@Entity
@Immutable
@Subselect("SELECT * FROM schedules")
@Synchronize("schedules")
public class Schedule implements Serializable {

	@Id
	private String jobName;
	@Id
	private String triggerName;
	
	private String cron;
	private String startAt;
	private String endAt;
	
	private Blob jobData;
	
	private String triggerState;

	public Schedule(){
	}
	
	public Schedule(String jobName, String triggerName, String cron, String startAt, String endAt, Blob jobData, String triggerState) {
		super();
		this.jobName = jobName;
		this.triggerName = triggerName;
		this.cron = cron;
		this.startAt = startAt;
		this.endAt = endAt;
		
		this.jobData = jobData;
		
		this.triggerState = triggerState;
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

	public void setStartAt(String startAt) {
		this.startAt = startAt;
	}

	public String getStartAt() {
		return startAt;
	}

	public void setEndAt(String endAt) {
		this.endAt = endAt;
	}

	public String getEndAt() {
		return endAt;
	}

	public void setJobData(Blob jobData) {
		this.jobData = jobData;
	}

	public Blob getJobData() {
		return jobData;
	}
	
	public void setTriggerState(String triggerState) {
		this.triggerState = triggerState;
	}

	public String getTriggerState() {
		return triggerState;
	}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Schedule that = (Schedule) o;

        if (getTriggerName() != null ? !getTriggerName().equals(that.getTriggerName()) : that.getTriggerName() != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return getTriggerName() != null ? getTriggerName().hashCode() : 0;
    }	
}
