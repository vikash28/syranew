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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import syra.etl.app.model.Job;
import syra.etl.app.model.ServerCredentials;
import syra.etl.app.model.User;
@Repository
public class JobRepository {

	 private static final Logger LOGGER = LoggerFactory.getLogger(JobRepository.class);
	 
	 @PersistenceContext
	 EntityManager em;
	 /**
	    *
	    * counts the matching servercredentials, given the bellow criteria
	    *
	    * @param user-id - the currently account
	    * @return -  a list of matching servercredentials, or an empty collection if no match found
	    */
	    public Long countservercredentials(long userId) {

	        CriteriaBuilder cb = em.getCriteriaBuilder();

	        // query for counting the total results
	        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
	        Root<Job> countRoot = cq.from(Job.class);
	        cq.select((cb.count(countRoot)));
	        cq.where(getCommonWhereCondition(cb, userId, countRoot));
	        Long resultsCount = em.createQuery(cq).getSingleResult();

	        LOGGER.info("Found " + resultsCount + " results.");

	        return resultsCount;
	    }

	    /**
	     *
	     * finds a list of folders, given the bellow criteria
	     *
	     * @param account-id - the currently account
	     * @return -  a list of matching folders, or an empty collection if no match found
	     */
	    public List<Job> findjobs(long userId) {

	        CriteriaBuilder cb = em.getCriteriaBuilder();

	        // the actual search query that returns one page of results
	        CriteriaQuery<Job> searchQuery = cb.createQuery(Job.class);
	        Root<Job> searchRoot = searchQuery.from(Job.class);
	        searchQuery.select(searchRoot);
	        searchQuery.where(getCommonWhereCondition(cb, userId, searchRoot));

	        List<Order> orderList = new ArrayList<Order>();
	        orderList.add(cb.desc(searchRoot.get("id")));
	        searchQuery.orderBy(orderList);

	        TypedQuery<Job> filterQuery = em.createQuery(searchQuery);
			
	        return filterQuery.getResultList();
	    }
	     
	 /**
	 *
	 * save changes made to a S3Credentials, or create the S3Credentials if its a new S3Credentials.
	 *
	 */
	public Job save(Job job) {
	    return em.merge(job);
	}
	
 
	 private Predicate[] getCommonWhereCondition(CriteriaBuilder cb, long userId, Root<Job> searchRoot) {
	
	       List<Predicate> predicates = new ArrayList<>();
	       Join<Job , User> user = searchRoot.join("user");
	
	       predicates.add(cb.equal(user.get("id"), userId));
	
	       return predicates.toArray(new Predicate[]{});
	   }
}
