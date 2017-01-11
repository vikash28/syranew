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

import syra.etl.app.dto.FolderDTO;
import syra.etl.app.dto.FoldersDTO;
import syra.etl.app.dto.S3CredentialDTO;
import syra.etl.app.dto.S3CredentialsDTO;
import syra.etl.app.model.Folder;
import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.SearchResult;
import syra.etl.app.services.S3CredentialsService;





@Controller
@RequestMapping("S3Credentials")
public class S3CredentialController {

    @Autowired
    private S3CredentialsService s3credentialsService;
    
    private static final Logger LOGGER = LoggerFactory.getLogger(S3CredentialController.class);
 
	 
   /**
    *
    * saves a list of folders (new or not) into the database
    *
    * @param username - the currently logged in user
    * @param folders - the list of folders to be saved
 * @return 
    * @return - the new versions of the saved folders
    */
    
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST)
    public  List<List<S3Credentials>> saveS3Credential(Principal principal, @RequestBody List<S3CredentialDTO> s3credential) {
    	
	   LOGGER.info("Found " + s3credential.toString() + " results.");
	   List<List<S3Credentials>> savedFolders= s3credentialsService.saveS3Credentials(s3credential);
	   return savedFolders;
	   
    }
    
    /**
     * search S3Credentials for the current user by date and time ranges.
     *
     *
     * @param principal  - the current logged in user
     * @return - @see S3CredentialDTO with the current page, total pages and the list of folders
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.PUT)
    public S3CredentialsDTO searchS3Credentials(Principal principal , @RequestParam("userId") Long userId) {
    	LOGGER.info("Found " + userId + " results.");
    	SearchResult<S3Credentials> result;
		result = s3credentialsService.findS3credentials(userId);
        result.getResultsCount();
        
        return new S3CredentialsDTO(S3CredentialDTO.mapFromS3credentialEntities(result.getResult()));
    }

}
