package syra.etl.app.controllers;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import syra.etl.app.dto.ScheduleDTO;
import syra.etl.app.dto.SchedulesDTO;
import syra.etl.app.model.Schedule;
import syra.etl.app.model.SearchResult;
import syra.etl.app.services.ScheduleService;

/**
 *
 *  REST service for schedules - allows to update, create and search for schedules for the currently logged in user.
 *
 */
@Controller
@RequestMapping("schedule")
public class ScheduleController {

    Logger LOGGER = LoggerFactory.getLogger(ScheduleController.class);

    @Autowired
    private ScheduleService scheduleService;

    /**
     * search Schedules for the current user by date and time ranges.
     *
     *
     * @param jobName  - the jobName
     * @return - @see Object with the current page, total pages and the list of schedules
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET)
    public SchedulesDTO searchSchedules(@RequestParam("jobName") String jobName) {
		
		SearchResult<Schedule> result = scheduleService.findSchedules(jobName);

        result.getResultsCount();

        return new SchedulesDTO(ScheduleDTO.mapFromSchedulesEntities(result.getResult()));
    }

    /**
     * Pause Schedules
     *
     *
     * @param triggerName  - the triggerName
     * @return - @see Object with the current page, total pages and the list of schedules
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/pause", method = RequestMethod.GET)
    public SchedulesDTO pauseSchedule(@RequestParam("triggerName") String triggerName) {
		
		SearchResult<Schedule> result = scheduleService.pauseSchedule(triggerName);

        result.getResultsCount();

        return new SchedulesDTO(ScheduleDTO.mapFromSchedulesEntities(result.getResult()));
    }	
	
    /**
     * Resume Schedules
     *
     *
     * @param triggerName  - the triggerName
     * @return - @see Object with the current page, total pages and the list of schedules
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/resume", method = RequestMethod.GET)
    public SchedulesDTO resumeSchedule(@RequestParam("triggerName") String triggerName) {
		
		SearchResult<Schedule> result = scheduleService.resumeSchedule(triggerName);

        result.getResultsCount();

        return new SchedulesDTO(ScheduleDTO.mapFromSchedulesEntities(result.getResult()));
    }	
	
    /**
     *
     * saves a list of schedules - they be either new or existing
     *
     * @param schedules - the list of schedules to save
     * @return - an updated version of the saved schedules
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.POST)
    public List<ScheduleDTO> saveSchedules(@RequestBody List<ScheduleDTO> schedules){
        List<Schedule> savedSchedules = scheduleService.saveSchedules(schedules);

        return savedSchedules.stream()
                .map(ScheduleDTO::mapFromScheduleEntity)
                .collect(Collectors.toList());
    }

    /**
     *
     * deletes a schedule
     *
     * @param triggerName - the ids of the schedules to be deleted
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteSchedule(@RequestBody String triggerName) {
        scheduleService.deleteSchedule(triggerName);
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
