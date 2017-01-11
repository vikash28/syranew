package syra.etl.app.controllers;


import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import syra.etl.app.dto.FolderDTO;
import syra.etl.app.dto.FoldersDTO;
//import syra.etl.app.model.Connection;
import syra.etl.app.model.Folder;
import syra.etl.app.model.SearchResult;
import syra.etl.app.services.FolderService;

/**
 *
 *  REST service for folders - allows to update, create and search for folders for the currently logged in user.
 *
 */
@Controller
@RequestMapping("folder")
public class FolderController {

   

    @Autowired
    private FolderService folderService;
    
    Logger LOGGER = LoggerFactory.getLogger(FolderController.class);
    /**
     * search Folders for the current user by date and time ranges.
     *
     *
     * @param principal  - the current logged in user
     * @return - @see FoldersDTO with the current page, total pages and the list of folders
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET)
    public FoldersDTO searchFolders(Principal principal) {
		
    	//Retrive user role id and account id of login user
    	@SuppressWarnings("unchecked")
		Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) SecurityContextHolder.getContext().getAuthentication().getAuthorities();
    	List<String> Privillege_Role=new ArrayList<String>();
    	String UserRole;
    	long AccountId;
    	
    	for (GrantedAuthority authority : authorities) {
    		//LOGGER.info("t"+ authority.getAuthority().toString() );
    		//UserRole = authority.getAuthority().toString() ;
    		Privillege_Role.add(  authority.getAuthority().toString() );
    	  }
    	
    	UserRole=  Privillege_Role.get(1);
    	AccountId= Long.parseLong( Privillege_Role.get(0));

    	 
    	SearchResult<Folder> result;
    	//the function on basis of user role
    	if( UserRole.equals("ADMIN")   )
    		{
    		LOGGER.info("If");
    		//the function on basis account-id
    		result = folderService.findFoldersAdmin( principal.getName(),AccountId);
            result.getResultsCount();
    		}
    	else
    		{
    		LOGGER.info("ELSE");
    		//the function on basis username
    		result = folderService.findFolders( principal.getName());
            result.getResultsCount();
    		}
    	
//    	SearchResult<Folder> result = folderService.findFolders(
//                principal.getName());
//
//        result.getResultsCount();

        return new FoldersDTO(FolderDTO.mapFromFoldersEntities(result.getResult()));
    }

    /**
     *
     * saves a list of folders - they be either new or existing
     *
     * @param principal - the current logged in user
     * @param folders - the list of folders to save
     * @return - an updated version of the saved folders
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST)
    public  List<FolderDTO> saveFolders(Principal principal, @RequestBody List<FolderDTO> folders) {

    	//LOGGER.info(folders.get(0).toString());
    	List<Folder> savedFolders = folderService.saveFolders(principal.getName(), folders);
        
        return savedFolders.stream()
                .map(FolderDTO::mapFromFolderEntity)
                .collect(Collectors.toList());
    	 
     }

    /**
     *
     * deletes a list of folders
     *
     * @param deletedFolderIds - the ids of the folders to be deleted
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteFolders(@RequestBody List<Long> deletedFolderIds) {
    	LOGGER.info(deletedFolderIds.toString());
        folderService.deleteFolders(deletedFolderIds);
    }

    /**
     *
     * error handler for backend errors - a 400 status code will be sent back, and the body
     * of the message contains the exception text.
     *
     * @param exc - the exception caught
     */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> errorHandler(Exception exc) {
        LOGGER.error(exc.getMessage(), exc);
        return new ResponseEntity<>(exc.getMessage(), HttpStatus.BAD_REQUEST);
    }


}
