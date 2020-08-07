package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import xyz.masq.annotation.Auth;
import xyz.masq.entity.Mark;
import xyz.masq.entity.PagedPostsResponse;
import xyz.masq.entity.Post;
import xyz.masq.entity.PostResponse;
import xyz.masq.error.GenericError;
import xyz.masq.repository.MarkRepository;
import xyz.masq.repository.PostRepository;
import xyz.masq.service.MarkService;
import xyz.masq.service.SessionService;

import java.util.ArrayList;
import java.util.List;


@RestController
@Slf4j
@RequestMapping("/marks")
@PropertySource("classpath:site.properties")
public class MarkController {

    @Value("${site.page.limit}")
    private int limit;

    @Autowired
    private MarkService markService;

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private SessionService sessionService;

    // receive request like '/mark?pid=20&action=mark'.
    @GetMapping(path = {"", "/"})
    @Auth(value = "logged")
    public String createMark(@RequestParam Integer pid, @RequestParam String action) {
        if (pid <= 0) throw new GenericError("Invalid post id to mark.");
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

    @GetMapping(path = "user/{uid}")
    @Auth(value = "author")
    public PagedPostsResponse getMarksByUser(@PathVariable Integer uid,
                                             @RequestParam (required = false) Integer page){
        if (page == null || page < 1) page = 1;
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("mid").descending());
        Page<Mark> marks = markRepository.findAllByUid(uid, pageable);
        List<Post> posts = new ArrayList<>();
        for (Mark mark: marks.toList()) {
            int pid = mark.getPid();
            Post post = postRepository.findByPid(pid);
            post.setMarked(markService.checkMarked(uid, pid));
            if (postRepository.findAuthorByPost(pid) == uid) post.setOwner(true);
            posts.add(post);
        }

        return new PagedPostsResponse(marks, posts, page);
    }
}
