package xyz.masq.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.masq.entity.Attachment;

@Repository
public interface AttachmentRepository extends CrudRepository<Attachment, Integer> {
}
