package xyz.masq.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import xyz.masq.entity.User;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Integer> {

    @Query(value = "SELECT * FROM users WHERE email=? LIMIT 1", nativeQuery = true)
    List<User> checkDuplicateEmail(String email);

    public User findByEmail(String email);

    public User findByUid(int uid);
}
