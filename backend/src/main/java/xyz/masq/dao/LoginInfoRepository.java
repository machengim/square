package xyz.masq.dao;

import org.springframework.data.repository.CrudRepository;
import xyz.masq.entity.LoginInfo;

import java.util.List;

public interface LoginInfoRepository extends CrudRepository<LoginInfo, Integer> {

    List<LoginInfo> findByUidOrderByCtimeDesc(int uid);
}
