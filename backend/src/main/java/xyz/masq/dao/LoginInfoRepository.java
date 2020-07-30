package xyz.masq.dao;

import org.springframework.data.repository.CrudRepository;
import xyz.masq.entity.LoginInfo;


public interface LoginInfoRepository extends CrudRepository<LoginInfo, Integer> {

}
