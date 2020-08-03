package xyz.masq.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import xyz.masq.lib.Utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Base64;

@Service
@Slf4j
@PropertySource("classpath:site.properties")
public class CookieService {

    @Autowired
    private HttpServletResponse response;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${site.cookie.days}")
    private int cookieLife;

    public int readUid() {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) return -1;

        String value = "";
        for (Cookie c: cookies) {
            if (c.getName().equals("u")) value = c.getValue();
        }

        return Utils.parsePositiveInt(value);
    }

    // Original json format is not allowed to set in cookie (has comma), so base64 involved here.
    public void writeCookie(String name, Object object) {
        Cookie cookie = new Cookie(name, object.toString());
        cookie.setMaxAge(cookieLife * 24 * 60 * 60);
        setCookie(cookie);
    }

    public void removeCookie(String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setMaxAge(0);
        setCookie(cookie);
    }

    private void setCookie(Cookie cookie) {
        cookie.setHttpOnly(false); //set to false so it can be read by client js.
        cookie.setPath("/");
        //cookie.setSecure(true);
        response.addCookie(cookie);
    }

    private String base64Json(Object object) {
        ObjectMapper mapper = new ObjectMapper();
        String json = null;
        try {
            json = mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            log.info("Cannot convert object to json string: " + object);
        }

        assert json != null;
        return Base64.getEncoder().encodeToString(json.getBytes());
    }
}
