package syra.etl.app.security;


import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManagerFactory;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import syra.etl.app.dao.UserRepository;
import syra.etl.app.model.Account;
import syra.etl.app.model.User;
 
import syra.etl.app.model.UserLog;

/**
 *
 * UserDetails service that reads the user credentials from the database, using a JPA repository.
 *
 */
@Service
public class SecurityUserDetailsService implements UserDetailsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityUserDetailsService.class);

    @Autowired
    private UserRepository userRepository;
   
    
    @Autowired
    private EntityManagerFactory entityManagerFactory;
    
    

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUsername(username);
		
        SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
        Session session = sessionFactory.openSession();
        Transaction transaction = session.beginTransaction();


        if (user == null) {
            String message = "Username not found" + username;
            LOGGER.info(message);
            throw new UsernameNotFoundException(message);
        }
        
        //Store user role id and account id of login user
        String user_role=  user.getRole();
        Account account= user.getaccount_id();
        String accountid=Long.toString( account.getAccountid() );
        
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user_role));
        authorities.add(new SimpleGrantedAuthority(accountid));

       // authorities.add(new SimpleGrantedAuthority());
        //List<GrantedAuthority> authorities = new ArrayList<>();
        //authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = new Date();
        
        UserLog user_log = new UserLog(user, "Admin", null, null, dateFormat.format(date), null);
        session.persist(user_log);
        transaction.commit();
        LOGGER.info("Found user in Role: " + user_log);

        //userlogRepository.save(new UserLog(user, "Admin", null, null, null, null));

        
        LOGGER.info("Found user in Role: " + user_role);
        LOGGER.info("Found user in Role: " + accountid);
        LOGGER.info("Found user in database: " + user);
        

        return new org.springframework.security.core.userdetails.User(username, user.getPasswordDigest(), authorities);
    }
}
