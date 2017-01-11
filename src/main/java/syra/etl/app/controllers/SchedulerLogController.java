package syra.etl.app.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import syra.etl.app.dto.SchedulerLogDTO;
import syra.etl.app.dto.SchedulerLogsDTO;
import syra.etl.app.model.SchedulerLog;
import syra.etl.app.model.SearchResult;
import syra.etl.app.services.SchedulerLogService;

/**
 *
 *  REST service for schedulerLogs - allows to update, create and search for schedulerLogs for the currently logged in user.
 *
 */
@Controller
@RequestMapping("schedulerlog")
public class SchedulerLogController {

    Logger LOGGER = LoggerFactory.getLogger(SchedulerLogController.class);

    @Autowired
    private SchedulerLogService schedulerLogService;

    /**
     * search SchedulerLogs for the current user by date and time ranges.
     *
     *
     * @param logName  - the logName
     * @param logType  - whether it's a Job or a Trigger Log
     * @return - @see Object with the current page, total pages and the list of schedulerLogs
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET)
    public SchedulerLogsDTO searchSchedulerLogs(@RequestParam("logName") String logName, 
								@RequestParam("logType") String logType) {
		if(logType.trim().equalsIgnoreCase("JOB")){
			SearchResult<SchedulerLog> result = schedulerLogService.findSchedulerLogsByJob(logName);

			result.getResultsCount();

			return new SchedulerLogsDTO(SchedulerLogDTO.mapFromSchedulerLogsEntities(result.getResult()));
		} else {
			SearchResult<SchedulerLog> result = schedulerLogService.findSchedulerLogsByTrigger(logName);

			result.getResultsCount();

			return new SchedulerLogsDTO(SchedulerLogDTO.mapFromSchedulerLogsEntities(result.getResult()));
		}
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
