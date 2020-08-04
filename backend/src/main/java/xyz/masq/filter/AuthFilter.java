package xyz.masq.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import xyz.masq.repository.UserRepository;
import xyz.masq.entity.User;
import xyz.masq.service.CookieService;
import xyz.masq.service.LoginInfoService;
import xyz.masq.service.SessionService;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * This filter is used to check whether user has a cookie declaring the identity,
 * if so, check whether the cookie info is valid against session or login history.
 * Note that the it's `uid` in session but `u` in cookie.
 * Four cases coud happen:
 * 1. No cookie nor session: do nothing;
 * 2. No cookie but has session: set cookie.
 * 3. Has cookie but no session: check against database;
 *      3.a found: set session and refresh cookie; 4.b not found: remove cookie;
 * 4. Has both: check equality.
 *      4.a true: do nothing; 4.b false: remove session and cookie.
 */
@Component
@Slf4j
@Order(1)
public class AuthFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private CookieService cookieService;

    @Autowired
    private LoginInfoService loginInfoService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        int uidCookie = cookieService.readUid();
        int uidSession = sessionService.readIntByKey("uid");

        if (uidCookie < 0 && uidSession > 0) {  // has session but no cookie, this is weird.
            //cookieService.writeCookie("u", uidSession);
            sessionService.removeSession();
        } else if (uidCookie > 0 && uidSession < 0) {
            if (loginInfoService.checkLoginHistory(uidCookie)) {
                User user = userRepository.findByUid(uidCookie);
                if (user != null && user.getType() > 0) {
                    sessionService.setUserInfo(user);
                    cookieService.writeCookie("u", user.getUid());
                }
            } else {
                cookieService.removeCookie("u");
                response.addHeader("Access-Control-Expose-Headers", "instruction");
                response.addHeader("instruction", "clear");
            }
        } else if (uidCookie > 0 && uidSession > 0 && uidCookie != uidSession) {
            sessionService.removeSession();
            cookieService.removeCookie("u");
        }

        chain.doFilter(request, response);
    }

}
