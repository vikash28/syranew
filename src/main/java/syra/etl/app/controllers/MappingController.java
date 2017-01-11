package syra.etl.app.controllers;


import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import syra.etl.app.dto.MappingDTO;
import syra.etl.app.dto.MappingsDTO;
import syra.etl.app.model.Mapping;
import syra.etl.app.model.SearchResult;
import syra.etl.app.services.MappingService;

/**
 *
 *  REST service for mappings - allows to update, create and search for mappings for the currently logged in user.
 *
 */
@Controller
@RequestMapping("mapping")
public class MappingController {

    Logger LOGGER = LoggerFactory.getLogger(MappingController.class);

    @Autowired
    private MappingService mappingService;

    /**
     * search Mappings for the current user by date and time ranges.
     *
     *
     * @param principal  - the current logged in user
     * @return - @see MappingsDTO with the current page, total pages and the list of mappings
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET)
    public MappingsDTO searchMappings(Principal principal) {
		
        SearchResult<Mapping> result = mappingService.findMappings(
                principal.getName());

        result.getResultsCount();

        return new MappingsDTO(MappingDTO.mapFromMappingsEntities(result.getResult()));
    }

    /**
     *
     * saves a list of mappings - they be either new or existing
     *
     * @param principal - the current logged in user
     * @param mappings - the list of mappings to save
     * @return - an updated version of the saved mappings
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST)
    public List<MappingDTO> saveMappings(Principal principal, @RequestBody List<MappingDTO> mappings) {

        List<Mapping> savedMappings = mappingService.saveMappings(principal.getName(), mappings);

        return savedMappings.stream()
                .map(MappingDTO::mapFromMappingEntity)
                .collect(Collectors.toList());
    }

    /**
     *
     * deletes a list of mappings
     *
     * @param deletedMappingIds - the ids of the mappings to be deleted
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteMappings(@RequestBody List<Long> deletedMappingIds) {
        mappingService.deleteMappings(deletedMappingIds);
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
