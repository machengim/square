package xyz.masq.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.masq.entity.Mark;

import java.util.List;

@Repository
public interface MarkRepository extends CrudRepository<Mark, Integer> {

    Mark findByUidAndPid(int uid, int pid);

    Mark findByMid(int mid);

    //int deleteByMid(int mid);
}
