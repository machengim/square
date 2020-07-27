package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.masq.dao.UserRepository;
import xyz.masq.entity.User;

import javax.transaction.Transactional;

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
    public String register(@RequestBody User user) {
        log.debug("Get user: " + user);
        userRepository.save(user);
        return "Saved";
    }

    @PostMapping(path = "/login")
    @ResponseBody
    @Transactional
    public String login(@RequestBody User user) {

        return "logged in";
    }
}
