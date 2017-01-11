package syra.etl.app.dto.serialization;

import java.io.IOException;

import org.quartz.JobDataMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

/**
 *
 * custom JSON serializer for org.quartz.JobDataMap type
 *
 */
public class CustomJobDataMapDeserializer extends JsonDeserializer<JobDataMap> {

    @SuppressWarnings("unused")
	private static final Logger LOGGER = LoggerFactory.getLogger(CustomJobDataMapDeserializer.class);

    @Override
    public JobDataMap deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        JobDataMap jobDataMap = new JobDataMap();
		jobDataMap.put("jobData", jp.getText());
        return jobDataMap;
    }

}
