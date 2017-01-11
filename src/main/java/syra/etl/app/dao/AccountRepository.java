package syra.etl.app.dao;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import syra.etl.app.model.Account;
 

public class AccountRepository {
	    
	    @PersistenceContext
	    private EntityManager em;
	    
	    /**
	    *
	    * save changes made to a account, or insert it if its new
	    *
	    * @param account
	    */
	   public void save(Account account) {
	       em.merge(account);
	   }
	   

}
