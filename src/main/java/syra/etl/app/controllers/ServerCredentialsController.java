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

import syra.etl.app.dto.S3CredentialDTO;
import syra.etl.app.dto.S3CredentialsDTO;
import syra.etl.app.dto.ServerCredentialDTO;
import syra.etl.app.dto.ServerCredentialsDTO;
import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.SearchResult;
import syra.etl.app.model.ServerCredentials;
import syra.etl.app.services.ServerCredentialsService;

@Controller
@RequestMapping("ServerCredentials")
public class ServerCredentialsController {

	@Autowired
	private ServerCredentialsService servercredentialsService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ServerCredentialsController.class);
    
   
	 /**
     * search ServerCredentials for the current user by date and time ranges.
     *
     *
     * @param principal  - the current logged in user
     * @return - @see ServerCredentialDTO with the current page, total pages and the list of folders
     */
	@ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.PUT)
    public ServerCredentialsDTO searchServerCredentials(Principal principal , @RequestParam("userId") Long userId) {
    	LOGGER.info("Found " + userId + " results.");
    	SearchResult<ServerCredentials> result;
		result = servercredentialsService.findServercredentials(userId);
        result.getResultsCount();
        
        return new ServerCredentialsDTO(ServerCredentialDTO.mapFromServercredentialEntities(result.getResult()));
    }
    
    /**
    *
    * saves a list of Server (new or not) into the database
    *
    * @param username - the currently logged in user
    * @param Server - the list of Servers to be saved
 * @return 
    * @return - the new versions of the saved Server
    */
    
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST)
    public  List<List<ServerCredentials>> saveServerCredential(Principal principal, @RequestBody List<ServerCredentialDTO> servercredential) {
    	
 	   LOGGER.info("Found " + servercredential.toString() + " results.");
 	   List<List<ServerCredentials>> savedServercredentialData= servercredentialsService.saveServerCredentials(servercredential);
 	   return savedServercredentialData;
 	   
     }
     
}
