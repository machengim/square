package xyz.masq.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import xyz.masq.dao.UserRepository;
import xyz.masq.entity.User;

@Controller
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping(path="/")
    @ResponseBody
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping(path = "/add")
    @ResponseBody
    public String addNewUser(@RequestBody User user) {
        System.out.println("User is "+ user);
        userRepository.save(user);
        return "Saved";
    }
}
