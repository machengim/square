package xyz.masq.lib;

import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.crypto.bcrypt.BCrypt;
import ua_parser.Client;
import ua_parser.Parser;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import javax.validation.ConstraintValidatorContext;
import java.io.IOException;
import java.util.Random;
import java.util.UUID;

@Slf4j
public class Utils {

    public static String generateUuid() {
        return UUID.randomUUID().toString();
    }

    public static String generateVerificationCode() {
        int code = new Random().nextInt(999999);
        return String.format("%06d", code);
    }

    public static String getCookieByName(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) return "";

        for (Cookie c: cookies) {
            if (c.getName().equals(name)) return c.getValue();
        }

        return null;
    }

    public static void setUidCookie(int uid, int daysToLive, HttpServletResponse res) {
        javax.servlet.http.Cookie cookie = new javax.servlet.http.Cookie("u", Integer.toString(uid));
        cookie.setMaxAge(daysToLive * 24 * 60 * 60);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        res.addCookie(cookie);
    }

    public static String extractIp(HttpServletRequest request) {
        String clientIp = request.getHeader("X-forwarded-for");
        if (clientIp == null) clientIp = request.getRemoteAddr();
        return clientIp;
    }

    public static String getDeviceDetails(HttpServletRequest request) {
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

    public static String bcrypt(String plain) {
        return BCrypt.hashpw(plain, BCrypt.gensalt());
    }

    public static boolean checkBcrypt(String current, String saved) {
        return BCrypt.checkpw(current, saved);
    }

    public static void validationErrorMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }

    public static DataSource getDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl("jdbc:postgresql://localhost:5432/test");
        dataSource.setUsername("square");
        dataSource.setPassword("qwer1234");

        return dataSource;
    }
}
