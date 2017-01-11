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

import syra.etl.app.dao.JobRepository;
import syra.etl.app.dao.S3CredentialsRepository;
import syra.etl.app.dao.ServerCredentialsRepository;
import syra.etl.app.dao.UserRepository;
import syra.etl.app.dto.JobDTO;
import syra.etl.app.model.Job;
import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.ServerCredentials;
import syra.etl.app.model.User;

/**
 *
 * Business service for Job -related operations.
 *
 */

@Service
public class JobService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(JobService.class);

	@Autowired
	JobRepository jobRepository;
	@Autowired
	ServerCredentialsRepository  serverCredentialsRepository;
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
   public List<Job> saveJob( Long id,String bucketName, String folderName, String filesJson,Long user_id,Long server_id ,Long s3_id) {	
   	   
	   LOGGER.info("Found " + user_id + " results.");
	  
   	   assertNotBlank(bucketName, "bucketname cannot be blank");
   	   assertNotBlank(folderName, "foldername cannot be blank");
   	   assertNotBlank(filesJson, "filesJson cannot be blank");
       notNull(user_id, "User Id is mandatory"); 
 
	 
      
    
       Job job = null;
       List<Job> ListJob=null;
       if (id != null) {
    	   //s3credentials = s3credentialsRepository.findS3CredentialsById(id);
    	   //s3credentials.setaccessKey(accessKey);
    	    
    	   //s3credentials.setUserId(user_id);

       } 
       
       else if( user_id != null){      	
  
    	   
    	User user = userRepository.findUserByUserID(user_id);
       	ServerCredentials server = serverCredentialsRepository.findServerCredentialsById(server_id);
        LOGGER.info("Found " + server + " results.");
       	S3Credentials s3 = s3credentialsRepository.findS3CredentialsById(s3_id);
       	if (user != null) {  
       		job = jobRepository.save(new Job(user,server,s3,bucketName,folderName,filesJson));
       		
       		ListJob = jobRepository.findjobs(user_id);
 
           } else {
               LOGGER.warn("A S3Credentials was attempted to be saved for a non-existing user: " + user_id);
			}
       	
       }
       else {
    	   LOGGER.warn("A S3Credentials was attempted to be saved for a non-existing user: " + user_id);
       } 

       return ListJob; 
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
 	public List<List<Job>> saveJobs(List<JobDTO> jobs) {	
    	LOGGER.info("Found " + jobs + " results.");
    	LOGGER.info("Found " + jobs.get(0).getJobbucketName() + " results.");
    	return jobs.stream()
                .map((job) -> saveJob(
                		job.getId(),
                		job.getJobbucketName(),
                		job.getJobfolderName(),
                		job.getJobfilesJson(),
                		job.getParentId(),
                		job.getServerId(),
                		job.getS3Id()
                        ))
                .collect(Collectors.toList());
 
    	 
	    }

}
