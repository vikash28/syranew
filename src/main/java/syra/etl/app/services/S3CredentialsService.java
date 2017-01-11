package syra.etl.app.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import syra.etl.app.dao.S3CredentialsRepository;
import syra.etl.app.dao.UserRepository;
import syra.etl.app.dto.S3CredentialDTO;
import syra.etl.app.model.Folder;
import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.SearchResult;
import syra.etl.app.model.User;

import static org.springframework.util.Assert.notNull;
import static syra.etl.app.services.ValidationUtils.assertNotBlank;

import java.util.List;
import java.util.stream.Collectors;


 


/**
 *
 * Business service for S3Credential -related operations.
 *
 */

@Service
public class S3CredentialsService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(S3CredentialsService.class);
	
    @Autowired
    S3CredentialsRepository s3credentialsRepository;

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
   public List<S3Credentials> saveS3Credential( Long id,String s3credentialsName, String accessKey ,String secretKey,Long user_id) {	
   	   
	   LOGGER.info("Found " + user_id + " results.");
   	   assertNotBlank(secretKey, "secretKey cannot be blank");
   	   assertNotBlank(accessKey, "accessKey cannot be blank");
       notNull(user_id, "User Id is mandatory");
       notNull(secretKey, "secretKey is mandatory");
       notNull(accessKey, "accessKey is mandatory");
	 
      
    
       S3Credentials s3credentials = null;
       List<S3Credentials> Lists3credentials=null;
       if (id != null) {
    	   s3credentials = s3credentialsRepository.findS3CredentialsById(id);
    	   s3credentials.setaccessKey(accessKey);
    	   s3credentials.setaccessKey(secretKey);
    	   //s3credentials.setUserId(user_id);

       } 
       
       else if( user_id != null){      	
       	User user = userRepository.findUserByUserID(user_id);
       	if (user != null) {
       		s3credentials = s3credentialsRepository.save(new S3Credentials(user,s3credentialsName,secretKey,accessKey));
       		
       		Lists3credentials = s3credentialsRepository.finds3credentials(user_id);
 
           } else {
               LOGGER.warn("A S3Credentials was attempted to be saved for a non-existing user: " + user_id);
			}
       	
       }
       else {
    	   LOGGER.warn("A S3Credentials was attempted to be saved for a non-existing user: " + user_id);
       } 

       return Lists3credentials; 
   }

   /**
    *
    * saves a list of S3Credentials (new or not) into the database
    *
    * @param username - the currently logged in user
    * @param s3credentials - the list of S3Credential to be saved
    * @return - the new versions of the saved folders
    */
   
   @Transactional
 	public List<List<S3Credentials>> saveS3Credentials(List<S3CredentialDTO> s3credentials) {	
    	LOGGER.info("Found " + s3credentials + " results.");
    	
    	return s3credentials.stream()
                .map((s3credential) -> saveS3Credential(
                		s3credential.getId(),
                		s3credential.gets3credentialsName(),
                		s3credential.getaccessKey(),
                		s3credential.getsecretKey(),
                		s3credential.getParentId()
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
  public SearchResult<S3Credentials> findS3credentials(Long userId) {

      Long resultsCount = s3credentialsRepository.counts3credentials(userId);

      List<S3Credentials> s3credentials = s3credentialsRepository.finds3credentials(userId);

      return new SearchResult<>(resultsCount, s3credentials);
  }
	 

}
 

 