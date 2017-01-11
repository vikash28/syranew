package syra.etl.app.services;

 

 
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import syra.etl.app.dao.UserLogRepository;
import syra.etl.app.dao.UserRepository;
import syra.etl.app.model.User;
import syra.etl.app.model.UserLog;
import syra.etl.app.model.SearchResult;

@Service
public class UserLogService {
	

	private static final Logger LOGGER = LoggerFactory.getLogger(UserLogService.class);
    
	@Autowired
	private UserLogRepository userlogRepository;
	
    @Autowired
    private UserRepository userRepository;
	
	 @Transactional
	 public void createUser(String username,String session_id,String ip_address,String user_agent,String log_time,String user_data) {

		 User user = userRepository.findUserByUsername(username);
		 UserLog userlog = new UserLog(user, session_id,ip_address,user_agent,log_time,user_data);
		 userlogRepository.save(userlog);
	    }	
    
	@Transactional(readOnly = true)
    public SearchResult<UserLog> findUserLogByUserId(String username,long UserId) {
		LOGGER.info("te"+UserId);
		List<UserLog> userlog = userlogRepository.findUserLogByUserId(username,UserId);
		LOGGER.info("te new"+userlog);
		return new SearchResult<>(userlog.size(), userlog);
    }
}
