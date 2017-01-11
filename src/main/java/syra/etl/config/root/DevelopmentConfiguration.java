package syra.etl.config.root;


import syra.etl.app.init.TestDataInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import syra.etl.app.scheduler.AutowiringSpringBeanJobFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Properties;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * Development specific configuration - creates a localhost postgresql datasource,
 * sets hibernate on create drop mode and inserts some test data on the database.
 *
 * Set -Dspring.profiles.active=development to activate this config.
 *
 */
@Configuration
@Profile("development")
@EnableTransactionManagement
public class DevelopmentConfiguration {
	@Autowired
	private ApplicationContext applicationContext;
	
    @Bean(initMethod = "init")
    public TestDataInitializer initTestData() {
        return new TestDataInitializer();
    }

    @Bean(name = "datasource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost/syra?loglevel=0");
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        return dataSource;
    }

    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DriverManagerDataSource dataSource) {

        LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactoryBean.setDataSource(dataSource);
        entityManagerFactoryBean.setPackagesToScan(new String[]{"syra.etl.app.model"});
        entityManagerFactoryBean.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver());
        entityManagerFactoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        Map<String, Object> jpaProperties = new HashMap<String, Object>();
        jpaProperties.put("hibernate.hbm2ddl.auto", "create-drop");
        jpaProperties.put("hibernate.show_sql", "true");
        jpaProperties.put("hibernate.format_sql", "true");
        jpaProperties.put("hibernate.use_sql_comments", "true");
        jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        entityManagerFactoryBean.setJpaPropertyMap(jpaProperties);

        return entityManagerFactoryBean;
    }

    @Bean(name = "scheduler")
	@Scope("singleton")
    public SchedulerFactoryBean scheduler() {
		SchedulerFactoryBean schedulerFactoryBean = new SchedulerFactoryBean();
		
		AutowiringSpringBeanJobFactory jobFactory = new AutowiringSpringBeanJobFactory();
		jobFactory.setApplicationContext(applicationContext);
		schedulerFactoryBean.setJobFactory(jobFactory);

		Properties quartzProperties = new Properties();
		quartzProperties.setProperty("org.quartz.scheduler.instanceId", "AUTO");
		quartzProperties.setProperty("org.quartz.scheduler.instanceName", "MyClusteredScheduler");
		quartzProperties.setProperty("org.quartz.jobStore.class","org.quartz.impl.jdbcjobstore.JobStoreTX");
		quartzProperties.setProperty("org.quartz.jobStore.driverDelegateClass","org.quartz.impl.jdbcjobstore.StdJDBCDelegate");
		quartzProperties.setProperty("org.quartz.jobStore.tablePrefix","QRTZ_");
		quartzProperties.setProperty("org.quartz.jobStore.isClustered","true");
		quartzProperties.setProperty("org.quartz.jobStore.clusterCheckinInterval","20000");
		quartzProperties.setProperty("org.quartz.jobStore.misfireThreshold","60000");
		
		quartzProperties.setProperty("org.quartz.plugin.triggHistory.class","org.quartz.plugins.history.LoggingTriggerHistoryPlugin");
		quartzProperties.setProperty("org.quartz.plugin.triggHistory.triggerFiredMessage","Trigger {1}.{0} fired job {6}.{5} at: {4, date, HH:mm:ss MM/dd/yyyy}");
		quartzProperties.setProperty("org.quartz.plugin.triggHistory.triggerCompleteMessage","Trigger {1}.{0} completed firing job {6}.{5} at {4, date, HH:mm:ss MM/dd/yyyy}");

		schedulerFactoryBean.setQuartzProperties(quartzProperties);

		schedulerFactoryBean.setDataSource(dataSource());

        return schedulerFactoryBean;
    }	
}
