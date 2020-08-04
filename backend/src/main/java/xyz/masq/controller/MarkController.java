package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.masq.annotation.Auth;
import xyz.masq.error.GenericError;
import xyz.masq.service.MarkService;
import xyz.masq.service.SessionService;

import javax.transaction.Transactional;


@RestController
@Slf4j
@RequestMapping("/mark")
public class MarkController {

    @Autowired
    private MarkService markService;

    @Autowired
    private SessionService sessionService;

    // receive request like '/mark?pid=20&action=mark'.
    @GetMapping(path = {"", "/"})
    @ResponseBody
    @Auth(value = "logged")
    public String createMark(@RequestParam Integer pid, @RequestParam String action) {
        if (pid == null || pid <= 0) throw new GenericError("Invalid post id to mark.");
        int uid = sessionService.readIntByKey("uid");

        if (action.equals("mark")) {
            markService.createMark(uid, pid);
        } else if (action.equals("unmark")) {
            markService.removeMark(uid, pid);
        } else {
            return "Unknown action.";
        }

        return "Success";
    }
}
