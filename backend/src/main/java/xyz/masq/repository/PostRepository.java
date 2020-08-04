package xyz.masq.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import xyz.masq.entity.Post;

import java.util.List;

public interface PostRepository extends PagingAndSortingRepository<Post, Integer> {

    @Query(value = "SELECT * FROM post WHERE isPrivate = 0 ORDER BY pid DESC LIMIT ?", nativeQuery = true)
    List<Post> findPublicPosts(int limit);

    @Query(value = "SELECT * FROM post WHERE pid < ? limit 1", nativeQuery = true)
    List<Post> checkMorePosts(int currentPid);

    @Query(value = "SELECT * FROM post WHERE isPrivate = 0 AND pid > ? ORDER BY pid DESC limit ?", nativeQuery = true)
    List<Post> findNewerPost(int pid, int limit);

    @Query(value = "SELECT * FROM post WHERE isPrivate = 0 AND pid < ? ORDER BY pid DESC limit ?", nativeQuery = true)
    List<Post> findOlderPost(int pid, int limit);

    Page<Post> findByUid(int uid, Pageable pageable);

}
