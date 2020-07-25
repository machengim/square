package xyz.masq.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/session")
public class SessionController {

    @ResponseBody
    @RequestMapping(value = {"", "/"})
    public String getSession(HttpServletRequest request) {
        request.getSession().setAttribute("user", "cheng");
        return request.getSession().getId();
    }

    @ResponseBody
    @RequestMapping("/get")
    public String get(HttpServletRequest request) {
        return  (String) request.getSession().getAttribute("maxInactiveInterval");
    }
}
