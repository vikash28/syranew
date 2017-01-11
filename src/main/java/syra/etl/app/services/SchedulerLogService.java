package syra.etl.app.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import syra.etl.app.dao.SchedulerLogRepository;
import syra.etl.app.model.SchedulerLog;
import syra.etl.app.model.SearchResult;

/**
 *
 * Business service for SchedulerLog-related operations.
 *
 */
@Service
public class SchedulerLogService {

    @SuppressWarnings("unused")
	private static final Logger LOGGER = LoggerFactory.getLogger(SchedulerLogService.class);

    @Autowired
    SchedulerLogRepository schedulerlogRepository;

    /**
     *
     * searches SchedulerLogs
     *
     * @param jobName - the jobName
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public SearchResult<SchedulerLog> findSchedulerLogsByJob(String jobName) {

        Long resultsCount = schedulerlogRepository.countSchedulerLogsByJob(jobName);

        List<SchedulerLog> schedulerlogs = schedulerlogRepository.findSchedulerLogsByJob(jobName);

        return new SearchResult<>(resultsCount, schedulerlogs);
    }
	
    /**
     *
     * searches SchedulerLogs
     *
     * @param triggerName - the triggerName
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public SearchResult<SchedulerLog> findSchedulerLogsByTrigger(String triggerName) {

        Long resultsCount = schedulerlogRepository.countSchedulerLogsByTrigger(triggerName);

        List<SchedulerLog> schedulerlogs = schedulerlogRepository.findSchedulerLogsByTrigger(triggerName);

        return new SearchResult<>(resultsCount, schedulerlogs);
    }	
}
