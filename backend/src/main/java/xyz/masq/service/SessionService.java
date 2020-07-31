package xyz.masq.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.filter.OrderedRequestContextFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.RequestContextFilter;
import xyz.masq.entity.User;
import xyz.masq.error.GenericError;
import xyz.masq.lib.Utils;
import javax.servlet.http.HttpSession;

@Service
@Slf4j
public class SessionService {

    @Autowired
    private HttpSession session;

    @Bean
    public RequestContextFilter requestContextFilter() {
        OrderedRequestContextFilter filter = new OrderedRequestContextFilter();
        filter.setOrder(0); // right before the start of `AuthFilter`.
        return filter;
    }

    // Used to retrieve the value from redis by the attribute name.
    public int readIntByKey(String key){
        if (session == null || session.getAttribute(key) == null) return -1;
        String valueString = session.getAttribute(key).toString();
        return Utils.parsePositiveInt(valueString);
    }

    public void setUserInfo(User user) {
        if (session == null) {
            throw new GenericError("No session available to set user info.");
        }

        session.setAttribute("uid", user.getUid());
        session.setAttribute("type", user.getType());
    }

    public void removeSession() {
        if (session != null)
            session.invalidate();
    }

}
