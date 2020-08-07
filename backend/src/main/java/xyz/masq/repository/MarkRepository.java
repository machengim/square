package xyz.masq.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import xyz.masq.entity.Mark;


@Repository
public interface MarkRepository extends PagingAndSortingRepository<Mark, Integer> {

    Mark findByUidAndPid(int uid, int pid);

    Page<Mark> findAllByUid(int uid, Pageable pageable);
}
