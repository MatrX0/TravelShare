package com.proje.maps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MapsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MapsApplication.class, args);
	}

}
