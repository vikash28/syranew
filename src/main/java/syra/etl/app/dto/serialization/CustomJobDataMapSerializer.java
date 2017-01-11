package syra.etl.app.dto.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import org.quartz.JobDataMap;
import java.io.IOException;

/**
 *
 * custom JSON deserializer for org.quartz.JobDataMap type
 *
 */
public class CustomJobDataMapSerializer extends JsonSerializer<JobDataMap> {

    @Override
    public void serialize(JobDataMap value, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonProcessingException {
		
		jgen.writeString(value.get("jobData").toString());
    }

}
