package syra.etl.app.dao;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.quartz.JobKey;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.stereotype.Repository;

import syra.etl.app.model.Mapping;
import syra.etl.app.model.User;


/**
 *
 * Repository class for the Mapping entity
 *
 */
@Repository
public class MappingRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(MappingRepository.class);

    @PersistenceContext
    EntityManager em;

	@Autowired
	private SchedulerFactoryBean schedulerFactoryBean;

    /**
     *
     * counts the matching mappings, given the bellow criteria
     *
     * @param username - the currently logged in username
     * @return -  a list of matching mappings, or an empty collection if no match found
     */
    public Long countMappings(String username) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // query for counting the total results
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Mapping> countRoot = cq.from(Mapping.class);
        cq.select((cb.count(countRoot)));
        cq.where(getCommonWhereCondition(cb, username, countRoot));
        Long resultsCount = em.createQuery(cq).getSingleResult();

        LOGGER.info("Found " + resultsCount + " results.");

        return resultsCount;
    }

    /**
     *
     * finds a list of mappings, given the bellow criteria
     *
     * @param username - the currently logged in username
     * @return -  a list of matching mappings, or an empty collection if no match found
     */
    public List<Mapping> findMappings(String username) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<Mapping> searchQuery = cb.createQuery(Mapping.class);
        Root<Mapping> searchRoot = searchQuery.from(Mapping.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getCommonWhereCondition(cb, username, searchRoot));

        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("mappingName")));
        searchQuery.orderBy(orderList);

        TypedQuery<Mapping> filterQuery = em.createQuery(searchQuery);
		
        return filterQuery.getResultList();
    }

    /**
     * Delete a mapping, given its identifier
     *
     * @param deletedMappingId - the id of the mapping to be deleted
     */
    public void delete(Long deletedMappingId) {
        Mapping delete = em.find(Mapping.class, deletedMappingId);
		
		try{
			// Remove all associated Quartz entities
			String mappingName = delete.getMappingName();
			Long id = delete.getId();
			schedulerFactoryBean.getScheduler().deleteJob(new JobKey(mappingName + ":::#" + id, "syra"));
			
			LOGGER.info("All associated Schdules are deleted for Mapping: " + mappingName);
		} catch(SchedulerException ex){
			LOGGER.error(ex.getMessage());
			// LOGGER.error(ex);
		}
		
        em.remove(delete);
    }

    /**
     *
     * finds a mapping given its id
     *
     */
    public Mapping findMappingById(Long id) {
        return em.find(Mapping.class, id);
    }

    /**
     *
     * save changes made to a mapping, or create the mapping if its a new mapping.
     *
     */
    public Mapping save(Mapping mapping) {
        return em.merge(mapping);
    }


    private Predicate[] getCommonWhereCondition(CriteriaBuilder cb, String username, Root<Mapping> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        Join<Mapping, User> user = searchRoot.join("user");

        predicates.add(cb.equal(user.<String>get("username"), username));

        return predicates.toArray(new Predicate[]{});
    }

}
