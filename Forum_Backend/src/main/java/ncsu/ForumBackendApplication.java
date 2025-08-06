package ncsu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
	    "ncsu",             // Main app
	    "ncsu.Forum_Backend_Classes",             // Replace with real
	    "ncsu.Forum_Backend_Major",
	    "ncsu.Forum_Backend_User",
	    "ncsu.Forum_Backend_Message"
	})
public class ForumBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ForumBackendApplication.class, args);
    }
}

