package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.masq.annotation.Auth;
import xyz.masq.repository.UserRepository;
import xyz.masq.entity.User;
import xyz.masq.entity.UserSummary;
import xyz.masq.error.AuthError;
import xyz.masq.lib.Utils;
import xyz.masq.service.CookieService;
import xyz.masq.service.LoginInfoService;
import xyz.masq.service.SessionService;
import javax.validation.Valid;

@RestController
@Slf4j
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private CookieService cookieService;

    @Autowired
    private LoginInfoService loginInfoService;

    @GetMapping(path={"", "/"})
    @Auth(value = "admin")
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
            throw new AuthError("Email already existed.");
        }

        String hashPw = Utils.bcrypt(user.getPassword());
        user.setPassword(hashPw);
        user.setType(1);    // TODO: Temporary use as no email service set up.
        userRepository.save(user);
        return "Register successfully.";
    }

    @PostMapping(path = "/login")
    @ResponseBody
    public UserSummary login(@Valid @RequestBody User user) {
        User userInDb = userRepository.findByEmail(user.getEmail());
        validateUserLogin(user, userInDb);

        loginInfoService.recordUserLogin(userInDb.getUid());
        sessionService.setUserInfo(userInDb);
        cookieService.writeCookie("u", userInDb.getUid());

        return new UserSummary(userInDb);
    }

    @GetMapping(path = "/summary/{uid}")
    @ResponseBody
    @Auth(value = "owner")
    public UserSummary getUserSummary(@PathVariable int uid) {
        if (uid <= 0 || uid != sessionService.readIntByKey("uid")) {
            log.info("Invalid uid to retrieve summary: " + uid);
            return null;
        }
        User user = userRepository.findByUid(uid);
        if (user == null) {
            log.info("Cannot retrieve user by uid: " + uid);
            return null;
        }

        return new UserSummary(user);
    }

    @GetMapping(path = "/logout")
    @ResponseBody
    public String logout() {
        cookieService.removeCookie("u");
        sessionService.removeSession();

        return "Success.";
    }

    private void validateUserLogin(User user, User userInDb) {
        if (userInDb == null) {
            throw new AuthError("Email not registered.");
        }

        if (!Utils.checkBcrypt(user.getPassword(), userInDb.getPassword())) {
            throw new AuthError("Email or password error.");
        }

        if (userInDb.getType() <= 0) {
            throw new AuthError("User status abnormal.");
        }
    }
}
