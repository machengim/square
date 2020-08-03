package xyz.masq.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.masq.entity.Attachment;

import java.util.List;

@Repository
public interface AttachmentRepository extends CrudRepository<Attachment, Integer> {

    public List<Attachment> findByPidOrderByAid(int pid);
}
