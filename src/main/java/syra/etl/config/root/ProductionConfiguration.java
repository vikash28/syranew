package syra.etl.config.root;


import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Scope;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import syra.etl.app.scheduler.AutowiringSpringBeanJobFactory;

/**
 *
 * Production specific configuration - creates a localhost postgresql datasource,
 * sets hibernate on create drop mode and inserts some test data on the database.
 *
 * Set -Dspring.profiles.active=production to activate this config.
 *
 */
@Configuration
@Profile("production")
@EnableTransactionManagement
public class ProductionConfiguration {

	@Autowired
	private ApplicationContext applicationContext;

    /*@Bean(initMethod = "init")
    public TestDataInitializer initTestData() {
        return new TestDataInitializer();
    }*/

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
        jpaProperties.put("hibernate.hbm2ddl.auto", "validate");
        jpaProperties.put("hibernate.show_sql", "false");
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
		quartzProperties.setProperty("org.quartz.scheduler.instanceName", "SyraClusteredScheduler");
		
		// Setup Database backed Job store releated properties
		quartzProperties.setProperty("org.quartz.jobStore.class","org.quartz.impl.jdbcjobstore.JobStoreTX");
		quartzProperties.setProperty("org.quartz.jobStore.driverDelegateClass","org.quartz.impl.jdbcjobstore.StdJDBCDelegate");
		quartzProperties.setProperty("org.quartz.jobStore.tablePrefix","QRTZ_");
		quartzProperties.setProperty("org.quartz.jobStore.isClustered","true");
		quartzProperties.setProperty("org.quartz.jobStore.clusterCheckinInterval","20000");
		quartzProperties.setProperty("org.quartz.jobStore.misfireThreshold","60000");
		
		// Enable Job History Plug-in
		quartzProperties.setProperty("org.quartz.plugin.jobHistory.class","org.quartz.plugins.history.LoggingJobHistoryPlugin");
		quartzProperties.setProperty("org.quartz.plugin.jobHistory.jobToBeFiredMessage","Job [{1}.{0}] to be fired by trigger [{4}.{3}], re-fire: {7}");
		quartzProperties.setProperty("org.quartz.plugin.jobHistory.jobSuccessMessage","Job [{1}.{0}] execution complete and reports: {8}");
		quartzProperties.setProperty("org.quartz.plugin.jobHistory.jobFailedMessage","Job [{1}.{0}] execution failed with exception: {8}");
		quartzProperties.setProperty("org.quartz.plugin.jobHistory.jobWasVetoedMessage","Job [{1}.{0}] was vetoed. It was to be fired by trigger [{4}.{3}] at: {2, date, dd-MM-yyyy HH:mm:ss.SSS}");
		
		// Enable Trigger History Plug-in
		quartzProperties.setProperty("org.quartz.plugin.triggerHistory.class","org.quartz.plugins.history.LoggingTriggerHistoryPlugin");
		quartzProperties.setProperty("org.quartz.plugin.triggerHistory.triggerFiredMessage","Trigger [{1}.{0}] fired job [{6}.{5}] scheduled at: {2, date, dd-MM-yyyy HH:mm:ss.SSS}, next scheduled at: {3, date, dd-MM-yyyy HH:mm:ss.SSS}");
		quartzProperties.setProperty("org.quartz.plugin.triggerHistory.triggerCompleteMessage","Trigger [{1}.{0}] completed firing job [{6}.{5}] with resulting trigger instruction code: {9}. Next scheduled at: {3, date, dd-MM-yyyy HH:mm:ss.SSS}");
		quartzProperties.setProperty("org.quartz.plugin.triggerHistory.triggerMisfiredMessage","Trigger [{1}.{0}] misfired job [{6}.{5}]. Should have fired at: {3, date, dd-MM-yyyy HH:mm:ss.SSS}");
		schedulerFactoryBean.setQuartzProperties(quartzProperties);

		schedulerFactoryBean.setDataSource(dataSource());

        return schedulerFactoryBean;
    }
}
