package xyz.masq.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import xyz.masq.lib.Utils;

@Component
@Slf4j
public class ScheduledTask {

    @Autowired
    private JedisPool jedisPool;

    // Note this value is in millisecond.
    @Value("${site.key.life}")
    private int keyLife;

    @Scheduled(fixedRateString ="${site.key.life}", initialDelay=1000)
    public void switchPassword() {
        Jedis jedis = jedisPool.getResource();

        if (jedis.get("current_key") != null) {
            jedis.set("previous_key", jedis.get("current_key"));
            // give extra 5 min to expire the key if it's still alive.
            jedis.expire("previous_key", keyLife/1000 + 300);
        }
        jedis.set("current_key", Utils.generateUuid());
        jedis.expire("current_key", keyLife/1000 + 300);
        jedis.close();
    }
}
