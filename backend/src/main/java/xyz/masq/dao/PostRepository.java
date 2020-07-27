package xyz.masq.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import xyz.masq.entity.Post;

import java.util.List;

public interface PostRepository extends CrudRepository<Post, Integer> {

    @Query(value = "SELECT * FROM post WHERE isPrivate = 0 ORDER BY pid DESC LIMIT ?", nativeQuery = true)
    List<Post> findPublicPosts(int limit);

    @Query(value = "SELECT * FROM post WHERE pid < ? limit 1", nativeQuery = true)
    List<Post> checkMorePosts(int currentPid);

}
