package xyz.masq.dao;

import org.springframework.data.repository.CrudRepository;
import xyz.masq.entity.User;

public interface UserRepository extends CrudRepository<User, Integer> {
}
