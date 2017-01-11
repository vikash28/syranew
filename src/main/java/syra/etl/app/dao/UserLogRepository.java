package syra.etl.app.dao;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
//import javax.persistence.criteria.Join;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import syra.etl.app.model.User;
import syra.etl.app.model.UserLog;

@Repository
public class UserLogRepository {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(UserLogRepository.class);
	
	 @PersistenceContext
	 EntityManager em;
    
    /**
    *
    * save changes made to a userlog, or insert it if its new
    *
    * @param userlog
    */
   public void save(UserLog userlog) {
	   LOGGER.info("Found " + userlog.getUser() + " results.");
       em.merge(userlog);
   }
   
   /**
   *
   * finds a list of userlog , given the bellow criteria
   *
   * @param UserId - the currently logged in username
   * @return -  a list of matching UserLog, or an empty collection if no match found
   */
   
   public List<UserLog> findUserLogByUserId(String username,long UserId) {
 
	   LOGGER.info("Found " + username + " results.");
	   CriteriaBuilder cb = em.getCriteriaBuilder();

       // the actual search query that returns one page of results
       CriteriaQuery<UserLog> searchQuery = cb.createQuery(UserLog.class);
       Root<UserLog> searchRoot = searchQuery.from(UserLog.class);
       searchQuery.select(searchRoot);
       searchQuery.where(getUserLogWhereCondition(cb, UserId, searchRoot));

       List<Order> orderList = new ArrayList<Order>();
       orderList.add(cb.desc(searchRoot.get("log_time")));
       searchQuery.orderBy(orderList);

       TypedQuery<UserLog> filterQuery = em.createQuery(searchQuery);
       LOGGER.info("Found " + UserId + " results.");
       return filterQuery.getResultList();
   }
   
   private Predicate[] getUserLogWhereCondition(CriteriaBuilder cb, long UserId, Root<UserLog> searchRoot) {

       List<Predicate> predicates = new ArrayList<>();
       Join<UserLog, User> user = searchRoot.join("user");

       predicates.add(cb.equal(user.get("id"), 1));
 
       return predicates.toArray(new Predicate[]{});
   }
}
