package syra.etl.app.dto;

import java.util.List;

/**
*
* JSON serializable DTO containing data concerning a UserLog search request.
*
*/

public class UserLoginLogsDTO {

	List<UserLoginLogDTO> userLoginLogDTO;
	
 
    public UserLoginLogsDTO(List<UserLoginLogDTO> userLoginLogDTO) {
        this.userLoginLogDTO = userLoginLogDTO;
    }

    public List<UserLoginLogDTO> getUserLog() {
        return userLoginLogDTO;
    }

    public void setUserLog(List<UserLoginLogDTO> userLoginLogDTO) {
        this.userLoginLogDTO = userLoginLogDTO;
    }

}
