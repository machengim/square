package xyz.masq.repository;

import org.springframework.data.repository.CrudRepository;
import xyz.masq.entity.LoginInfo;

import java.util.List;


public interface LoginInfoRepository extends CrudRepository<LoginInfo, Integer> {

    public List<LoginInfo> findByUidAndIpAndDeviceOrderByCtimeDesc(int uid, String ip, String device);

    public List<LoginInfo> findByUidOrderByCtimeDesc(int uid);
}
