package syra.etl.app.dto;

import java.util.List;
import java.util.stream.Collectors;

import syra.etl.app.model.UserLog;
 

/**
 *
 * JSON-serializable DTO containing user Login Log
 *
 */
public class UserLoginLogDTO {
	
    private String log_time;

    public UserLoginLogDTO(String log_time) {
        this.log_time = log_time;
    }
    
    public static UserLoginLogDTO mapFromUserLogEntity(UserLog userlog) {
        return new UserLoginLogDTO(userlog.getLogTime());
    }
    
    public static List<UserLoginLogDTO> mapFromUserLogEntities(List<UserLog> userlogs) {
        return userlogs.stream().map((userlog) -> mapFromUserLogEntity(userlog)).collect(Collectors.toList());
    }
    
    public String getLogTime() {
        return log_time;
    }

    public void setLogTime(String log_time) {
        this.log_time = log_time;
    }
}
