package xyz.masq.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.masq.entity.Comment;

import java.time.Instant;
import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Integer> {

    List<Comment> findAllByPid(int pid);

    @Query(value = "SELECT pid, count(*) FROM comment WHERE ctime > ? GROUP BY pid", nativeQuery = true)
    public List<Integer[]> findRecentComments(Instant ctime);
}
