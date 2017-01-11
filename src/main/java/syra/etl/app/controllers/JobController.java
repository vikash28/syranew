package syra.etl.app.controllers;

import java.security.Principal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import syra.etl.app.dto.JobDTO;
import syra.etl.app.model.Job;
import syra.etl.app.services.JobService;

 

/**
*
*  REST service for jobs - allows to update, create and search for jobs for the currently logged in user.
*
*/
@Controller
@RequestMapping("Jobs")
public class JobController {
	
	@Autowired
	private JobService jobService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(JobController.class);

	
	
	
     
   
	 /**
     * search Job for the current user by date and time ranges.
     *
     *
     * @param principal  - the current logged in user
     * @return - @see JobDTO with the current page, total pages and the list of jobs
     */
/*	@ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.PUT)
    public ServerCredentialsDTO searchServerCredentials(Principal principal , @RequestParam("userId") Long userId) {
    	LOGGER.info("Found " + userId + " results.");
    	SearchResult<ServerCredentials> result;
		result = servercredentialsService.findServercredentials(userId);
        result.getResultsCount();
        
        return new ServerCredentialsDTO(ServerCredentialDTO.mapFromServercredentialEntities(result.getResult()));
    }*/
	
	 /**
    *
    * saves a list of Job (new or not) into the database
    *
    * @param username - the currently logged in user
    * @param Job - the list of Jobs to be saved
 * @return 
    * @return - the new versions of the saved job
    */
    
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST)
    public  List<List<Job>> saveJob(Principal principal, @RequestBody List<JobDTO> jobs) {
    	
 	   LOGGER.info("Found " + jobs.get(0).toString()+ " results.");
 	   List<List<Job>> jobData= jobService.saveJobs(jobs);
 	   return jobData; 
 	  
     }

}
