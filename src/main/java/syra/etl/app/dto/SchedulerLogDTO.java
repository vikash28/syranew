package syra.etl.app.dto;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import syra.etl.app.model.SchedulerLog;

/**
 *
 * JSON serializable DTO containing SchedulerLog data
 *
 */
public class SchedulerLogDTO {

	private String fireInstanceId;
	private String jobName;
	private String triggerName;
	private String levelString;
	private String timestmp;
	private String startMsg;
	private String typeMsg;	
	private String resultMsg;

	private SimpleDateFormat parserSDF = new SimpleDateFormat("dd MMMM yyyy HH:mm Z");
	
    public SchedulerLogDTO() {
    }
	
	public SchedulerLogDTO(String fireInstanceId, String jobName, String triggerName, 
			String levelString, String timestmp, String startMsg, String typeMsg, String resultMsg) {
		this.fireInstanceId = fireInstanceId;
		this.jobName = jobName;
		this.triggerName = triggerName;
		this.levelString = levelString;
		this.timestmp = timestmp;
		this.startMsg = startMsg;
		this.typeMsg = typeMsg;
		this.resultMsg = resultMsg;
	}

    public static SchedulerLogDTO mapFromSchedulerLogEntity(SchedulerLog schedulerLog) {
        return new SchedulerLogDTO(schedulerLog.getFireInstanceId(), schedulerLog.getJobName(), 
						schedulerLog.getTriggerName(), schedulerLog.getLevelString(), 
						schedulerLog.getTimestmp(), schedulerLog.getStartMsg(), schedulerLog.getTypeMsg(),
						schedulerLog.getResultMsg());
    }

    public static List<SchedulerLogDTO> mapFromSchedulerLogsEntities(List<SchedulerLog> schedulerLogs) {
        return schedulerLogs.stream().map((schedulerLog) -> mapFromSchedulerLogEntity(schedulerLog)).collect(Collectors.toList());
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

	public String getTimestmpEx() {
		if(timestmp == null || timestmp.trim().equals("") || timestmp.trim().equals("0")){
			return "";
		} else {
			try{
				return parserSDF.format(new Date(Long.parseLong(timestmp)));
			}catch(Exception ex){}
			
			return "";
		}
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
