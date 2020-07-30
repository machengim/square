package xyz.masq.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import xyz.masq.lib.Utils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.Instant;
import java.util.List;


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

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        HttpSession session = request.getSession();
        int uidCookie = Utils.parseUid(Utils.getCookieByName(request, "u"));
        String uidFromSessionStr = (session.getAttribute("uid") == null)? null: session.getAttribute("uid").toString();
        int uidSession = Utils.parseUid(uidFromSessionStr);

        if (uidCookie < 0 && uidSession > 0) {
            Utils.setUidCookie(uidSession, 7, response);
        } else if (uidCookie > 0 && uidSession < 0) {
            if (checkLoginHistory(request, uidCookie)) {
                session.setAttribute("uid", uidCookie);
                Utils.setUidCookie(uidCookie, 7, response);
            } else {
                Utils.setUidCookie(-1, 0, response);
            }
        } else if (uidCookie > 0 && uidSession > 0 && uidCookie != uidSession) {
            session.removeAttribute("uid");
            Utils.setUidCookie(-1, 0, response);
        }

        chain.doFilter(request, response);
    }



    private boolean checkLoginHistory(HttpServletRequest request, int uid) {
        String ip = Utils.extractIp(request);
        String device = Utils.getDeviceDetails(request);
        JdbcTemplate jdbc = new JdbcTemplate(Utils.getDataSource());
        String sql = "SELECT ctime FROM login WHERE uid=? AND ip=? AND device=? ORDER BY ctime DESC LIMIT 1";
        List<Instant> logins = jdbc.queryForList(sql, Instant.class, uid, ip, device);
        System.out.println(logins);
        if (logins.size() == 0) return false;

        Instant lastLogin = logins.get(0);
        Instant threshold = Instant.now().minusSeconds(60 * 60 * 24 * 7);
        return (lastLogin.compareTo(threshold) > 0);
    }

}
