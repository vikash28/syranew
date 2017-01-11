package syra.etl.app;


import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import syra.etl.app.model.User;
import syra.etl.app.services.UserService;
import syra.etl.config.root.RootContextConfig;
import syra.etl.config.root.TestConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@ContextConfiguration(classes={TestConfiguration.class, RootContextConfig.class})
public class UserServiceTest {

    public static final String USERNAME = "test123";

    @Autowired
    private UserService userService;

    @PersistenceContext
    private EntityManager em;

    @Test
    public void testFindUserByUsername() {
        User user = findUserByUsername(USERNAME);
        assertNotNull("User is mandatory",user);
        assertTrue("Unexpected user " + user.getUsername(), user.getUsername().equals(USERNAME));
    }

    @Test
    public void testUserNotFound() {
        User user = findUserByUsername("doesnotexist");
        assertNull("User must be null", user);
    }

    @Test
    public void testCreateValidUser() {
        userService.createUser("test456", "test@gmail.com","Password3", "ADMIN", null);
        User user = findUserByUsername("test456");

        assertTrue("username not expected " + user.getUsername(), "test456".equals(user.getUsername()) );
        assertTrue("email not expected " + user.getEmail(), "test@gmail.com".equals(user.getEmail()) );

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        assertTrue("password not expected " + user.getPasswordDigest(), passwordEncoder.matches("Password3",user.getPasswordDigest()) );
    }

    @Test(expected = IllegalArgumentException.class)
    public void testBlankUser() {
        userService.createUser("", "test@gmail.com","Password3", "ADMIN", null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testUsernameLength() {
        userService.createUser("tes", "test@gmail.com","Password3", "ADMIN", null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testUsernameAvailable() {
        userService.createUser("test123", "test@gmail.com","Password3", "ADMIN", null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testBlankEmail() {
        userService.createUser("test001", "","Password3", "ADMIN", null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testInvalidEmail() {
        userService.createUser("test001", "test","Password3", "ADMIN", null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testBlankPassword() {
        userService.createUser("test002", "test@gmail.com","", "ADMIN", null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testPasswordPolicy() {
        userService.createUser("test003", "test@gmail.com","Password", "ADMIN", null);
    }


    private User findUserByUsername(String username) {
        @SuppressWarnings("unchecked")
		List<User> users = em.createQuery("select u from User u where username = :username")
                .setParameter("username", username).getResultList();

        return users.size() == 1 ? users.get(0) : null;
    }


}
