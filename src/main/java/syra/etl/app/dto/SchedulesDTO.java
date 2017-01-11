package syra.etl.app.dto;

import java.util.List;

/**
 *
 * JSON serializable DTO containing data concerning a schedule search request.
 *
 */
public class SchedulesDTO {

    List<ScheduleDTO> schedules;

    public SchedulesDTO(List<ScheduleDTO> schedules) {
        this.schedules = schedules;
    }

    public List<ScheduleDTO> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<ScheduleDTO> schedules) {
        this.schedules = schedules;
    }
}
