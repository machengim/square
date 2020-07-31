package xyz.masq.repository;

import org.springframework.data.repository.CrudRepository;
import xyz.masq.entity.User;

public interface UserRepository extends CrudRepository<User, Integer> {

    public User findByEmail(String email);

    public User findByUid(int uid);
}
