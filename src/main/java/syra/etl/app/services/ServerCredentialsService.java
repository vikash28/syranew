package syra.etl.app.services;

import static org.springframework.util.Assert.notNull;
import static syra.etl.app.services.ValidationUtils.assertNotBlank;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import syra.etl.app.dao.ServerCredentialsRepository;
import syra.etl.app.dao.UserRepository;
import syra.etl.app.dto.ServerCredentialDTO;
import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.SearchResult;
import syra.etl.app.model.ServerCredentials;
import syra.etl.app.model.User;

@Service
public class ServerCredentialsService {

	private static final Logger LOGGER=LoggerFactory.getLogger(ServerCredentialsService.class);
	
    @Autowired
    ServerCredentialsRepository serverCredentialsRepository;

    @Autowired
    UserRepository userRepository;
    
	/**
    *
    * saves a folder (new or not) into the database.
    *
    * @param username - - the currently logged in user
    * @param id - the database ud of the folder
    * @return - the new version of the folder
    */

   @Transactional 
   public List<ServerCredentials> saveServerCredential( Long id,String ServerName,String ipaddress,Long port, String username ,String password,Long user_id) {	
    
	   LOGGER.info("Found " + user_id + " results.");
	   
	   
	   assertNotBlank(ServerName, "ServerName cannot be blank");
   	   assertNotBlank(ipaddress, "ipaddress cannot be blank");
   	   assertNotBlank(username, "username cannot be blank");
   	   assertNotBlank(password, "password cannot be blank");
       notNull(user_id, "User Id is mandatory");
       notNull(ServerName, "ServerName is mandatory");
       notNull(ipaddress, "ipaddress is mandatory");
       notNull(username, "username is mandatory");
       notNull(password, "password is mandatory");
	 
      
    
       ServerCredentials servercredentials = null;
       List<ServerCredentials> Listservercredentials=null;
       if (id != null) {
    	   ///s3credentials = serverCredentialsRepository.findS3CredentialsById(id);
    	   //s3credentials.setaccessKey(accessKey);
    	   //s3credentials.setaccessKey(secretKey);
    	   //s3credentials.setUserId(user_id);

       } 
       
       else if( user_id != null){      	
       	User user = userRepository.findUserByUserID(user_id);
       	if (user != null) {
       		servercredentials = serverCredentialsRepository.save(new ServerCredentials( user , ServerName, port, username, password, ipaddress));
       		
       		Listservercredentials = serverCredentialsRepository.findservercredentials(user_id);
 
           } else {
               LOGGER.warn("A ServerCredentials was attempted to be saved for a non-existing user: " + user_id);
			}
       	
       }
       else {
    	   LOGGER.warn("A ServerCredentials was attempted to be saved for a non-existing user: " + user_id);
       } 

       return Listservercredentials; 
    }
   	
   /**
    *
    * saves a list of ServerCredentials (new or not) into the database
    *
    * @param username - the currently logged in user
    * @param servercredential - the list of ServerCredentials to be saved
    * @return - the new versions of the saved ServerCredentials
    */
   
   @Transactional
 	public List<List<ServerCredentials>> saveServerCredentials(List<ServerCredentialDTO> servercredentials) {	
    	LOGGER.info("Found " + servercredentials + " results.");
    	
    	 return servercredentials.stream()
                .map((servercredential) -> saveServerCredential(
                		servercredential.getId(),
                		servercredential.getServerName(),
                		servercredential.getipaddress(),
                		servercredential.getport(),
                		servercredential.getusername(),
                		servercredential.getpassword(),
                		servercredential.getParentId()
                        ))
                .collect(Collectors.toList()); 
 
    	 
	    }
   /**
   *
   * searches S3Credentials by date/time
   *
   * @param username - the currently logged in user
   * @return - the found results
   */
   @Transactional(readOnly = true)
   public SearchResult<ServerCredentials> findServercredentials(Long userId) {

      Long resultsCount = serverCredentialsRepository.countservercredentials(userId);

      List<ServerCredentials> servercredentials = serverCredentialsRepository.findservercredentials(userId);

      return new SearchResult<>(resultsCount, servercredentials);
   }
	
}
