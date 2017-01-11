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

import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.ServerCredentials;
import syra.etl.app.model.User;
 

/**
*
* Repository class for the  S3Credentials entity
*
*/
@Repository
public class S3CredentialsRepository {

	 private static final Logger LOGGER = LoggerFactory.getLogger(S3CredentialsRepository.class);
	 
	 @PersistenceContext
	 EntityManager em;
 
	  /**
	    *
	    * counts the matching s3credentials, given the bellow criteria
	    *
	    * @param user-id - the currently account
	    * @return -  a list of matching s3credentials, or an empty collection if no match found
	    */
	    public Long counts3credentials(long userId) {

	        CriteriaBuilder cb = em.getCriteriaBuilder();

	        // query for counting the total results
	        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
	        Root<S3Credentials> countRoot = cq.from(S3Credentials.class);
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
	    public List<S3Credentials> finds3credentials(long userId) {

	        CriteriaBuilder cb = em.getCriteriaBuilder();

	        // the actual search query that returns one page of results
	        CriteriaQuery<S3Credentials> searchQuery = cb.createQuery(S3Credentials.class);
	        Root<S3Credentials> searchRoot = searchQuery.from(S3Credentials.class);
	        searchQuery.select(searchRoot);
	        searchQuery.where(getCommonWhereCondition(cb, userId, searchRoot));

	        List<Order> orderList = new ArrayList<Order>();
	        orderList.add(cb.desc(searchRoot.get("id")));
	        searchQuery.orderBy(orderList);

	        TypedQuery<S3Credentials> filterQuery = em.createQuery(searchQuery);
			
	        return filterQuery.getResultList();
	    }
	    
	    
	    /**
     *
     * save changes made to a S3Credentials, or create the S3Credentials if its a new S3Credentials.
     *
     */
    public S3Credentials save(S3Credentials s3credential) {
        return em.merge(s3credential);
    }
    /**
    *
    * finds a S3Credentials given its id
    *
    */
   public S3Credentials findDataS3CredentialsById(Long id) {
       return em.find(S3Credentials.class, id);
   }
   
   /**
    * finds a ServerCredentials given its id
    *
    * @param id - the id of the searched ServerCredentials
    * @return  a matching ServerCredentials, or null if no ServerCredentials found.
    */
   public S3Credentials findS3CredentialsById(long s3_id) {

       List<S3Credentials> s3Credentials = em.createNamedQuery(S3Credentials.FIND_BY_S3CREDENTIALSID, S3Credentials.class)
               .setParameter("id", s3_id)
               .getResultList();

       return s3Credentials.size() == 1 ? s3Credentials.get(0) : null;
	    }
   
   
   private Predicate[] getCommonWhereCondition(CriteriaBuilder cb, long userId, Root<S3Credentials> searchRoot) {

       List<Predicate> predicates = new ArrayList<>();
       Join<S3Credentials, User> user = searchRoot.join("user");

       predicates.add(cb.equal(user.get("id"), userId));

       return predicates.toArray(new Predicate[]{});
   }

}
