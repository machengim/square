package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.masq.dao.LoginInfoRepository;
import xyz.masq.dao.UserRepository;
import xyz.masq.entity.LoginInfo;
import xyz.masq.entity.User;
import xyz.masq.entity.UserSummary;
import xyz.masq.error.LoginError;
import xyz.masq.lib.Utils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@RestController
@Slf4j
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginInfoRepository loginInfoRepository;

    // TODO: this api is not available to normal users.
    @GetMapping(path={"", "/"})
    @ResponseBody
    public Iterable<User> getAllUsers() {
        log.debug("Getting all users!");
        return userRepository.findAll();
    }

    @PostMapping(path = "/register")
    @ResponseBody
    public String register(@Valid @RequestBody User user) {
        User userInDb = userRepository.findByEmail(user.getEmail());
        if (userInDb != null) {
            throw new LoginError("Email already existed.");
        }

        String hashPw = Utils.bcrypt(user.getPassword());
        user.setPassword(hashPw);
        user.setType(1);    // TODO: Temporary use as no email sending service set up.
        userRepository.save(user);
        return "Register successfully.";
    }

    @PostMapping(path = "/login")
    @ResponseBody
    public UserSummary login(@Valid @RequestBody User user, HttpServletRequest request,
                        HttpServletResponse response) {
        User userInDb = userRepository.findByEmail(user.getEmail());
        if (userInDb == null) {
            throw new LoginError("Email not registered.");
        }

        if (!Utils.checkBcrypt(user.getPassword(), userInDb.getPassword())) {
            throw new LoginError("Email or password error.");
        }

        if (userInDb.getType() <= 0) {
            throw new LoginError("User status abnormal.");
        }

        int uid = userInDb.getUid();
        recordLoginInfo(request, uid);
        request.getSession().setAttribute("uid", uid);
        Utils.setUidCookie(uid, 7, response);
        return new UserSummary(userInDb);
    }

    @GetMapping(path = "/summary")
    @ResponseBody
    public UserSummary getUserSummary(HttpServletRequest request) {
        int uid = getUidFromSession(request);
        if (uid <= 0) return null;
        User user = userRepository.findByUid(uid);
        if (user == null) return null;
        return new UserSummary(user);
    }

    @GetMapping(path = "/logout")
    @ResponseBody
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        int uid = getUidFromSession(request);
        if (session != null)
            session.invalidate();
        if (uid > 0)
            Utils.setUidCookie(-1, 0, response);

        return "Success.";
    }

    private void recordLoginInfo(HttpServletRequest request, int uid) {
        String ip = Utils.extractIp(request);
        String device = Utils.getDeviceDetails(request);
        LoginInfo loginInfo = new LoginInfo();
        loginInfo.setUid(uid);
        loginInfo.setIp(ip);
        loginInfo.setDevice(device);
        loginInfoRepository.save(loginInfo);
    }

    private int getUidFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("uid") == null) return -1;
        return Utils.parseUid(session.getAttribute("uid").toString());
    }

}
