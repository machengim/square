package xyz.masq.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.time.Duration;

@Configuration
public class JedisConfig {

    final JedisPoolConfig poolConfig = buildPoolConfig();

    @Value("${spring.redis.password}")
    private String password;

    @Bean
    public JedisPool getJedisPool() {
        return new JedisPool(poolConfig, "localhost", 6379, 2000, password);
    }

    private JedisPoolConfig buildPoolConfig() {
        final JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(64);
        poolConfig.setMaxIdle(64);
        poolConfig.setMinIdle(16);

        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);
        poolConfig.setTestWhileIdle(true);
        poolConfig.setMinEvictableIdleTimeMillis(Duration.ofSeconds(60).toMillis());
        poolConfig.setTimeBetweenEvictionRunsMillis(Duration.ofSeconds(30).toMillis());
        poolConfig.setNumTestsPerEvictionRun(3);
        poolConfig.setBlockWhenExhausted(true);

        return poolConfig;
    }
}
