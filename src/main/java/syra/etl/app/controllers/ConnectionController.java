package syra.etl.app.controllers;


import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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

import syra.etl.app.dto.ConnectionDTO;
import syra.etl.app.dto.ConnectionsDTO;
import syra.etl.app.model.Connection;
import syra.etl.app.model.SearchResult;
import syra.etl.app.services.ConnectionService;

/**
 *
 *  REST service for connections - allows to update, create and search for connections for the currently logged in user.
 *
 */
@Controller
@RequestMapping("connection")
public class ConnectionController {

    Logger LOGGER = LoggerFactory.getLogger(ConnectionController.class);

    @Autowired
    private ConnectionService connectionService;

    /**
     * search Connections for the current user by date and time ranges.
     *
     *
     * @param principal  - the current logged in user
     * @return - @see ConnectionsDTO with the current page, total pages and the list of connections
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET)
    public ConnectionsDTO searchConnections(Principal principal,@RequestParam("folderId") String folderId ) {
    	LOGGER.info("Found " + folderId);
/*    	@SuppressWarnings("unchecked")
		Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) SecurityContextHolder.getContext().getAuthentication().getAuthorities();
    	String UserRole=null;
    	for (GrantedAuthority authority : authorities) {
    		UserRole = authority.getAuthority().toString() ;
    	  }
    	
    	LOGGER.info(UserRole);
    	//UserRole="1";
    	 * 
*/    	
    	//Retrive user role id and account id of login user
   /* 	@SuppressWarnings("unchecked")
		Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) SecurityContextHolder.getContext().getAuthentication().getAuthorities();
    	List<String> Privillege_Role=new ArrayList<String>();
    	String UserRole;
    	long AccountId;
    	
    	for (GrantedAuthority authority : authorities) {
    		Privillege_Role.add(  authority.getAuthority().toString() );
    	  }
    	
    	UserRole=  Privillege_Role.get(1);
    	AccountId= Long.parseLong( Privillege_Role.get(0));
    	
    	SearchResult<Connection> result;
    	
    	if( UserRole.equals("ADMIN")  )
    		{
    		result = connectionService.findConnectionsAdmin(principal.getName(),AccountId);
    		result.getResultsCount();
    		}
    	else
    		{
    		result = connectionService.findConnections(principal.getName());
    		result.getResultsCount();
    		}
    	//LOGGER.info("Found " + result.getResult() + " results.");
        return new ConnectionsDTO(ConnectionDTO.mapFromConnectionsEntities(result.getResult()));*/
    	 long folder_Id=Long.parseLong(folderId);
    	 SearchResult<Connection> result = connectionService.findConnectionsByFolder(
                principal.getName(),folder_Id);

        result.getResultsCount();

        return new ConnectionsDTO(ConnectionDTO.mapFromConnectionsEntities(result.getResult()));
    }

    /**
     *
     * saves a list of connections - they be either new or existing
     *
     * @param principal - the current logged in user
     * @param connections - the list of connections to save
     * @return - an updated version of the saved connections
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST)
    public List<ConnectionDTO> saveConnections(Principal principal, @RequestBody List<ConnectionDTO> connections) {

    	//LOGGER.info(connections.toString());
    	List<Connection> savedConnections = connectionService.saveConnections(principal.getName(), connections);

        return savedConnections.stream()
                .map(ConnectionDTO::mapFromConnectionEntity)
                .collect(Collectors.toList());
    }

    /**
     *
     * deletes a list of connections
     *
     * @param deletedConnectionIds - the ids of the connections to be deleted
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteConnections(@RequestBody List<Long> deletedConnectionIds) {
        connectionService.deleteConnections(deletedConnectionIds);
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
