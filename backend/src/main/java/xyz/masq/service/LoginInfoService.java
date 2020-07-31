package xyz.masq.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import ua_parser.Client;
import ua_parser.Parser;
import xyz.masq.entity.LoginInfo;
import xyz.masq.repository.LoginInfoRepository;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.Instant;
import java.util.List;

/**
 * TODO: translate IP address into real world location.
 * What if the IP or device info cannot be extracted from request?
 */
@Service
@Slf4j
@PropertySource("classpath:site.properties")
public class LoginInfoService {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private LoginInfoRepository loginInfoRepository;

    @Value("${site.cookie.days}")
    private int cookieLife;

    public void recordUserLogin(int uid) {
        String ip = extractIp();
        String device = extractDevice();
        if (ip == null || device == null) {
            log.info("Cannot retrieve user ip or device. Login info recording aborted.");
            return;
        }

        LoginInfo loginInfo = new LoginInfo();
        loginInfo.setUid(uid);
        loginInfo.setIp(ip);
        loginInfo.setDevice(device);
        loginInfoRepository.save(loginInfo);
    }

    // Check whether user has logged in within a certain period.
    public boolean checkLoginHistory(int uid){
        String ip = extractIp();
        String device = extractDevice();
        if (ip == null || device == null) {
            log.info("Cannot retrive user ip or device to validate against login history");
            return false;
        }

        List<LoginInfo> infos = loginInfoRepository.findByUidAndIpAndDeviceOrderByCtimeDesc(uid, ip, device);
        if (infos == null || infos.size() == 0) {
            log.info("No login history found for uid: " + uid);
            return false;
        }

        Instant threshold = Instant.now().minusSeconds(cookieLife * 60 * 60 * 24);
        Instant lastLogin = infos.get(0).getCtime();
        return (lastLogin.compareTo(threshold) > 0);
    }

    private String extractIp() {
        String clientIp = request.getHeader("X-forwarded-for");
        if (clientIp == null) clientIp = request.getRemoteAddr();
        return clientIp;
    }

    private String extractDevice() {
        String userAgent = request.getHeader("User-Agent");
        String device = null;
        try {
            Parser parser = new Parser();
            Client client = parser.parse(userAgent);
            if (client != null) {
                device = client.userAgent.family + " - " + client.os.family;
            }
        } catch (IOException e) {
            log.error("Cannot parse user agent: " + e);
        }

        return device;
    }
}
