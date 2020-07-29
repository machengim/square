package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.masq.dao.UserRepository;
import xyz.masq.entity.User;
import xyz.masq.error.LoginError;
import xyz.masq.lib.Utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RestController
@Slf4j
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

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
        userRepository.save(user);
        return "Register successfully.";
    }

    @PostMapping(path = "/login")
    @ResponseBody
    public String login(@Valid @RequestBody User user, HttpServletRequest request,
                        HttpServletResponse response) {
        User userInDb = userRepository.findByEmail(user.getEmail());
        if (userInDb == null) {
            throw new LoginError("Email not registered.");
        }

        if (!Utils.checkBcrypt(user.getPassword(), userInDb.getPassword())) {
            throw new LoginError("Email or password error.");
        }
        //TODO: check user status.
        //TODO: record user login IP and device.
        int uid = userInDb.getUid();
        System.out.println("login uid: " + uid);
        Utils.setUidCookie(uid, 7, response);

        return "Login successfully.";
    }

}
