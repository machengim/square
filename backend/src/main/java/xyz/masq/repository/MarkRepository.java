package xyz.masq.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import xyz.masq.entity.Mark;

import java.time.Instant;
import java.util.List;


@Repository
public interface MarkRepository extends PagingAndSortingRepository<Mark, Integer> {

    Mark findByUidAndPid(int uid, int pid);

    Page<Mark> findAllByUid(int uid, Pageable pageable);

    @Query(value = "SELECT pid, count(*) FROM mark WHERE ctime > ? GROUP BY pid", nativeQuery = true)
    List<Integer[]> findRecentMarks(Instant ctime);
}
