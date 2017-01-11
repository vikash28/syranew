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
* Repository class for the  ServerCredentials entity
*
*/
@Repository
public class ServerCredentialsRepository {

	 private static final Logger LOGGER = LoggerFactory.getLogger(ServerCredentialsRepository.class);
	 
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
	        Root<ServerCredentials> countRoot = cq.from(ServerCredentials.class);
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
	    public List<ServerCredentials> findservercredentials(long userId) {

	        CriteriaBuilder cb = em.getCriteriaBuilder();

	        // the actual search query that returns one page of results
	        CriteriaQuery<ServerCredentials> searchQuery = cb.createQuery(ServerCredentials.class);
	        Root<ServerCredentials> searchRoot = searchQuery.from(ServerCredentials.class);
	        searchQuery.select(searchRoot);
	        searchQuery.where(getCommonWhereCondition(cb, userId, searchRoot));

	        List<Order> orderList = new ArrayList<Order>();
	        orderList.add(cb.desc(searchRoot.get("id")));
	        searchQuery.orderBy(orderList);

	        TypedQuery<ServerCredentials> filterQuery = em.createQuery(searchQuery);
			
	        return filterQuery.getResultList();
	    }
	    
	    /**
  *
  * save changes made to a ServerCredentials, or create the ServerCredentials if its a new ServerCredentials.
  *
  */
	 public ServerCredentials save(ServerCredentials servercredential) {
     return em.merge(servercredential);
	 }
	 
    /**
     * finds a ServerCredentials given its id
     *
     * @param id - the id of the searched ServerCredentials
     * @return  a matching ServerCredentials, or null if no ServerCredentials found.
     */
    public ServerCredentials findServerCredentialsById(long server_id) {

        List<ServerCredentials> serverCredentials = em.createNamedQuery(ServerCredentials.FIND_BY_SERVERCREDENTIALSID, ServerCredentials.class)
                .setParameter("id", server_id)
                .getResultList();

        return serverCredentials.size() == 1 ? serverCredentials.get(0) : null;
	    }
	 
	 private Predicate[] getCommonWhereCondition(CriteriaBuilder cb, long userId, Root<ServerCredentials> searchRoot) {

	       List<Predicate> predicates = new ArrayList<>();
	       Join<ServerCredentials, User> user = searchRoot.join("user");

	       predicates.add(cb.equal(user.get("id"), userId));

	       return predicates.toArray(new Predicate[]{});
	   }
}
