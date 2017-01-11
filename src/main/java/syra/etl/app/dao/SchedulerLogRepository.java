package syra.etl.app.dao;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import syra.etl.app.model.SchedulerLog;

/**
 *
 * Repository class for the SchedulerLog entity
 *
 */
@Repository
public class SchedulerLogRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(SchedulerLogRepository.class);

    @PersistenceContext
    EntityManager em;

    /**
     *
     * counts the matching schedules, given the bellow criteria
     *
     * @param jobName - the currently logged in jobName
     * @return -  a list of matching schedules, or an empty collection if no match found
     */
    public Long countSchedulerLogsByJob(String jobName) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // query for counting the total results
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<SchedulerLog> countRoot = cq.from(SchedulerLog.class);
        cq.select((cb.count(countRoot)));
        cq.where(getJobWhereCondition(cb, jobName, countRoot));
        Long resultsCount = em.createQuery(cq).getSingleResult();

        LOGGER.info("Found " + resultsCount + " results.");

        return resultsCount;
    }

    /**
     *
     * counts the matching schedules, given the bellow criteria
     *
     * @param triggerName - the currently logged in triggerName
     * @return -  a list of matching schedules, or an empty collection if no match found
     */
    public Long countSchedulerLogsByTrigger(String triggerName) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // query for counting the total results
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<SchedulerLog> countRoot = cq.from(SchedulerLog.class);
        cq.select((cb.count(countRoot)));
        cq.where(getTriggerWhereCondition(cb, triggerName, countRoot));
        Long resultsCount = em.createQuery(cq).getSingleResult();

        LOGGER.info("Found " + resultsCount + " results.");

        return resultsCount;
    }

    /**
     *
     * finds a list of schedules, given the bellow criteria
     *
     * @param jobName - the currently logged in jobName
     * @return -  a list of matching schedules, or an empty collection if no match found
     */
    public List<SchedulerLog> findSchedulerLogsByJob(String jobName) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<SchedulerLog> searchQuery = cb.createQuery(SchedulerLog.class);
        Root<SchedulerLog> searchRoot = searchQuery.from(SchedulerLog.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getJobWhereCondition(cb, jobName, searchRoot));

        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("timestmp")));
        searchQuery.orderBy(orderList);

        TypedQuery<SchedulerLog> filterQuery = em.createQuery(searchQuery);
		
        return filterQuery.getResultList();
    }

    /**
     *
     * finds a list of schedules, given the bellow criteria
     *
     * @param triggerName - the currently logged in triggerName
     * @return -  a list of matching schedules, or an empty collection if no match found
     */
    public List<SchedulerLog> findSchedulerLogsByTrigger(String triggerName) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<SchedulerLog> searchQuery = cb.createQuery(SchedulerLog.class);
        Root<SchedulerLog> searchRoot = searchQuery.from(SchedulerLog.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getTriggerWhereCondition(cb, triggerName, searchRoot));
		
        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("timestmp")));
        searchQuery.orderBy(orderList);

        TypedQuery<SchedulerLog> filterQuery = em.createQuery(searchQuery);
		
        return filterQuery.getResultList();
    }

    /**
     *
     * finds a schedule given its jobName
     *
     */
    public SchedulerLog findSchedulerLogById(String fireInstanceId) {
        return em.find(SchedulerLog.class, fireInstanceId);
    }

    private Predicate[] getJobWhereCondition(CriteriaBuilder cb, String jobName, Root<SchedulerLog> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        //Join<SchedulerLog, User> user = searchRoot.join("user");

        predicates.add(cb.equal(searchRoot.<String>get("jobName"), jobName));

        return predicates.toArray(new Predicate[]{});
    }

    private Predicate[] getTriggerWhereCondition(CriteriaBuilder cb, String triggerName, Root<SchedulerLog> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        //Join<SchedulerLog, User> user = searchRoot.join("user");

        predicates.add(cb.equal(searchRoot.<String>get("triggerName"), triggerName));

        return predicates.toArray(new Predicate[]{});
    }
}
