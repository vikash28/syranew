package syra.etl.app.dto;

import java.util.List;

/**
 *
 * JSON serializable DTO containing data concerning a schedule search request.
 *
 */
public class SchedulerLogsDTO {

    List<SchedulerLogDTO> schedulerLogs;

    public SchedulerLogsDTO(List<SchedulerLogDTO> schedulerLogs) {
        this.schedulerLogs = schedulerLogs;
    }

    public List<SchedulerLogDTO> getSchedulerLogs() {
        return schedulerLogs;
    }

    public void setSchedulerLogs(List<SchedulerLogDTO> schedulerLogs) {
        this.schedulerLogs = schedulerLogs;
    }
}
