package xyz.masq.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import xyz.masq.entity.Post;
import xyz.masq.repository.CommentRepository;
import xyz.masq.repository.MarkRepository;
import xyz.masq.repository.PostRepository;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@PropertySource("classpath:site.properties")
public class TrendingService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private JedisPool jedisPool;

    @Value("${site.trending.limit}")
    private int limit;

    public List<Post> findTrendingPost(Integer days) {
        Jedis jedis = jedisPool.getResource();
        String key = "trending_";
        switch (days) {
            case 7:
                key += "week"; break;
            case 30:
                key += "month"; break;
            default:
                key += "day"; break;
        }

        if (!jedis.exists(key)) return new ArrayList<Post>();

        List<Integer> pids = jedis.lrange(key, 0, 20).stream()
                .map(this::convertStrToInt).collect(Collectors.toList());

        return getPostsFromList(pids);
    }

    private List<Post> getPostsFromList(List<Integer> pids) {
        List<Post> posts = new ArrayList<>();

        for (Integer pid: pids) {
            if (pid <= 0) continue;
            Post post = postRepository.findByPid(pid);
            if (post.getStatus() > 0) posts.add(post);
            if (posts.size() >= limit) break;
        }

        return posts;
    }

    private Integer convertStrToInt(String s) {
        int i = -1;
        try {
            i = Integer.parseInt(s);
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }

        return i;
    }

    /*
    // TODO: save trending posts in Redis.
    public List<Post> findTrendingPost(Integer hours) {
        HashMap<Integer, Integer> trends = new HashMap<>();
        Instant ctime = Instant.now().minusSeconds(hours * 60 * 60);
        List<Integer[]> comments = commentRepository.findRecentComments(ctime);
        List<Integer[]> marks = markRepository.findRecentMarks(ctime);
        comments.addAll(marks);

        HashMap<Integer, Integer> orderedTrends = getOrderedTrends(comments, trends);
        return getPostsFromMap(orderedTrends);
    }

    // Get a hashmap with key 'pid' and value 'count(*)' and sort it.
    private HashMap<Integer, Integer> getOrderedTrends(List<Integer[]> records,
                                                       HashMap<Integer, Integer> trends) {
        for (Integer[] record: records) {
            if (trends.containsKey(record[0])) {
                trends.put(record[0], trends.get(record[0]) + record[1]);
            } else {
                trends.put(record[0], record[1]);
            }
        }

        return (HashMap<Integer, Integer>) sortByValue(trends);
    }

    // Given an sorted trending hashmap, retrieve the trending posts accordingly into a list.
    private List<Post> getPostsFromMap(HashMap<Integer, Integer> trends) {
        List<Post> posts = new ArrayList<>();

        for (Map.Entry<Integer, Integer> entry: trends.entrySet()) {
            Post post = postRepository.findByPid(entry.getKey());
            if (post.getStatus() > 0) posts.add(post);
            if (posts.size() >= limit) break;
        }

        return posts;
    }

    // helper method to sort the hashmap by value.
    private static Map<Integer, Integer> sortByValue(Map<Integer, Integer> map) {
        List<Map.Entry<Integer, Integer>> list = new ArrayList<>(map.entrySet());
        Comparator<Map.Entry<Integer, Integer>> comparator = Map.Entry.comparingByValue();
        list.sort(comparator.reversed());

        Map<Integer, Integer> result = new LinkedHashMap<>();
        for (Map.Entry<Integer, Integer> entry : list) {
            result.put(entry.getKey(), entry.getValue());
        }

        return result;
    }
     */
}
