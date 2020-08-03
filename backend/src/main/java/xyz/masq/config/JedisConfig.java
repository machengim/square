package xyz.masq.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import redis.clients.jedis.Jedis;

/**
 * The Jedis bean has critical issue as it cannot close the connection automatically.
 */
@Configuration
@PropertySource("classpath:site.properties")
public class JedisConfig {

    @Value("${spring.redis.password}")
    private String password;

    @Bean
    public Jedis getJedis() {
        Jedis jedis = new Jedis();
        jedis.auth(password);
        return jedis;
    }
}
