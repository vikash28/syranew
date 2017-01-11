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

import syra.etl.app.model.Schedule;
import syra.etl.app.model.ScheduleKey;

/**
 *
 * Repository class for the Schedule entity
 *
 */
@Repository
public class ScheduleRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScheduleRepository.class);

    @PersistenceContext
    EntityManager em;

    /**
     *
     * counts the matching schedules, given the bellow criteria
     *
     * @param jobName - the currently logged in jobName
     * @return -  a list of matching schedules, or an empty collection if no match found
     */
    public Long countSchedules(String jobName) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // query for counting the total results
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Schedule> countRoot = cq.from(Schedule.class);
        cq.select((cb.count(countRoot)));
        cq.where(getJobWhereCondition(cb, jobName, countRoot));
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
    public List<Schedule> findSchedules(String jobName) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<Schedule> searchQuery = cb.createQuery(Schedule.class);
        Root<Schedule> searchRoot = searchQuery.from(Schedule.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getJobWhereCondition(cb, jobName, searchRoot));

        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("triggerName")));
        searchQuery.orderBy(orderList);

        TypedQuery<Schedule> filterQuery = em.createQuery(searchQuery);
		
        return filterQuery.getResultList();
    }

    /**
     *
     * finds a list of schedules, given the bellow criteria
     *
     * @param triggerName - the currently logged in triggerName
     * @return -  a list of matching schedules, or an empty collection if no match found
     */
    public List<Schedule> findTrigger(String triggerName) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<Schedule> searchQuery = cb.createQuery(Schedule.class);
        Root<Schedule> searchRoot = searchQuery.from(Schedule.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getTriggerWhereCondition(cb, triggerName, searchRoot));
		
        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("triggerName")));
        searchQuery.orderBy(orderList);

        TypedQuery<Schedule> filterQuery = em.createQuery(searchQuery);
		
        return filterQuery.getResultList();
    }	

    /**
     * Delete a schedule, given its identifier
     *
     * @param deletedScheduleId - the id of the schedule to be deleted
     */
    public void delete(Long deletedScheduleId) {
        Schedule delete = em.find(Schedule.class, deletedScheduleId);
        em.remove(delete);
    }

    /**
     *
     * finds a schedule given its jobName
     *
     */
    public Schedule findScheduleById(String jobName, String triggerName) {
        return em.find(Schedule.class, new ScheduleKey(jobName, triggerName));
    }

    /**
     *
     * save changes made to a schedule, or create the schedule if its a new schedule.
     *
     */
    public Schedule save(Schedule schedule) {
        return em.merge(schedule);
    }


    private Predicate[] getJobWhereCondition(CriteriaBuilder cb, String jobName, Root<Schedule> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        //Join<Schedule, User> user = searchRoot.join("user");

        predicates.add(cb.equal(searchRoot.<String>get("jobName"), jobName));

        return predicates.toArray(new Predicate[]{});
    }

    private Predicate[] getTriggerWhereCondition(CriteriaBuilder cb, String triggerName, Root<Schedule> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        //Join<Schedule, User> user = searchRoot.join("user");

        predicates.add(cb.equal(searchRoot.<String>get("triggerName"), triggerName));

        return predicates.toArray(new Predicate[]{});
    }
}
