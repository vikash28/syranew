package syra.etl.app.controllers;


import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import syra.etl.app.dto.MappingsViewDTO;
import syra.etl.app.dto.MappingsViewsDTO;
import syra.etl.app.model.MappingsView;
import syra.etl.app.model.SearchResult;
import syra.etl.app.services.MappingsViewService;

/**
 *
 *  REST service for mappingsview - allows to update, create and search for mappingsview for the currently logged in user.
 *
 */
@Controller
@RequestMapping("mappingsview")
public class MappingsViewController {

    Logger LOGGER = LoggerFactory.getLogger(MappingsViewController.class);

    @Autowired
    private MappingsViewService mappingsviewService;

    /**
     * search MappingsView for the current user by date and time ranges.
     *
     *
     * @param principal  - the current logged in user
     * @return - @see MappingsViewsDTO with the current page, total pages and the list of mappingsview
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET)
    public MappingsViewsDTO searchMappingsView(Principal principal) {
		
        SearchResult<MappingsView> result = mappingsviewService.findMappingsViews(
                principal.getName());

        result.getResultsCount();

        return new MappingsViewsDTO(MappingsViewDTO.mapFromMappingsViewsEntities(result.getResult()));
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
