package xyz.masq.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import xyz.masq.lib.Utils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
@Order(1)
@Slf4j
public class AuthFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req,
                         ServletResponse res,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        HttpSession session = request.getSession();
        String uidFromCookieStr = Utils.getCookieByName(request, "uid");
        String uidFromSessionStr = (String) session.getAttribute("uid");

        // Direct bypass cases:
        // 1. uidFromSessionStr == null && uidFromCookieStr == null;
        // 2. uidFromSessionStr == uidFromCookieStr;
        if (uidFromSessionStr == null && uidFromCookieStr != null && uidFromCookieStr.length() > 0) {
            // first request after long leave, with cookie and without session.
            int uidFromCookie = parseUid(uidFromCookieStr);
            if (uidFromCookie > 0 && checkLoginHistory(uidFromCookie)) {
                session.setAttribute("uid", uidFromCookie);
                Utils.setUidCookie(uidFromCookie, 7, response);
            } else if (uidFromCookie > 0) {
                log.error("Invalid or expired user info in cookie: " + uidFromCookieStr);
                Utils.setUidCookie(-1, -1, response);
            }
        } else if (uidFromSessionStr != null && !uidFromSessionStr.equals(uidFromCookieStr)) {
            // inconsistent uids.
            log.error("Different uids from session and cookie");
            session.setAttribute("uid", null);
            Utils.setUidCookie(-1, -1, response);
        }

        chain.doFilter(req, res);
    }

    private boolean checkLoginHistory(int uid) {
        // check user login history against db, and throw exception if fails.
        return true;
    }

    private int parseUid(String uidStr) {
        int uid = -1;
        try {
            uid = Integer.parseInt(uidStr);
        } catch (NumberFormatException e) {
            log.error("Cannot parse uid.");
        }

        return uid;
    }

}
