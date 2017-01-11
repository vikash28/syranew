package syra.etl.app.controllers;


import java.security.Principal;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

 
import syra.etl.app.dto.NewUserDTO;
import syra.etl.app.dto.UserLoginLogDTO;
import syra.etl.app.dto.UserLoginLogsDTO;
import syra.etl.app.dto.UserInfoDTO;
import syra.etl.app.model.SearchResult;
import syra.etl.app.model.User;
import syra.etl.app.model.UserLog;
import syra.etl.app.services.UserService;
import syra.etl.app.services.UserLogService;
//import syra.etl.app.model.UserLog;
/**
 *
 *  REST service for users.
 *
 */

@Controller
@RequestMapping("/user")
public class UserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserService userService;
    
    @Autowired
    UserLogService userLogService;

    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET)
    public UserInfoDTO getUserInfo(Principal principal) {

        User user = userService.findUserByUsername(principal.getName());

        return user != null ? new UserInfoDTO(user.getUsername(),user.getaccount_id(),user.getId(),user.getRole()) : null;
    }
    
    /**
     * search User log for the current user.
     *
     *
     * @param UserId  - the user Id
     * @return - @see Object with the log information from userlog table
     */
    
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/userlog", method = RequestMethod.GET)
    public UserLoginLogsDTO getUserLog(Principal principal,@RequestParam("UserId") String UserId) {

    	LOGGER.info("te"+UserId);
    	long UserId1=1;
    	SearchResult<UserLog> result = userLogService.findUserLogByUserId(principal.getName(),UserId1);
    	LOGGER.info(result.toString());
    	result.getResultsCount();
        return new UserLoginLogsDTO(UserLoginLogDTO.mapFromUserLogEntities(result.getResult()));
 
    }
    
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST)
    public void createUser(@RequestBody NewUserDTO user) {
        userService.createUser(user.getUsername(), user.getEmail(), user.getPlainTextPassword(), "ADMIN", user.getaccount_id() );
    }

  
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> errorHandler(Exception exc) {
        LOGGER.error(exc.getMessage(), exc);
        return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
