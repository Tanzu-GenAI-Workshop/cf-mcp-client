package org.tanzu.mcpclient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CfMcpClientApplication {

	private static final Logger logger = LoggerFactory.getLogger(CfMcpClientApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(CfMcpClientApplication.class, args);
	}

	@Bean
	ApplicationRunner vcapLoggingRunner() {
		return args -> {
			logger.info("================ VCAP ENVIRONMENT VARIABLES ================");
			logger.info("VCAP_APPLICATION: {}", System.getenv("VCAP_APPLICATION"));
			logger.info("VCAP_SERVICES: {}", System.getenv("VCAP_SERVICES"));
			logger.info("==========================================================");
		};
	}

}
