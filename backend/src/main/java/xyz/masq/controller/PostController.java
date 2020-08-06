package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import xyz.masq.annotation.Auth;
import xyz.masq.entity.PostRequest;
import xyz.masq.entity.User;
import xyz.masq.error.AuthError;
import xyz.masq.error.GenericError;
import xyz.masq.repository.PostRepository;
import xyz.masq.entity.Post;
import xyz.masq.entity.PostResponse;
import xyz.masq.repository.UserRepository;
import xyz.masq.service.AttachmentService;
import xyz.masq.service.MarkService;
import xyz.masq.service.SessionService;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@PropertySource("classpath:site.properties")
@RestController
@Slf4j
@RequestMapping(path = "/posts")
public class PostController {

    @Value("${site.page.limit}")
    private int limit;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private MarkService markService;

    @GetMapping(path = {"", "/"})
    public PostResponse getPublicPosts(@RequestParam(required = false) Integer min,
                                       @RequestParam(required = false) Integer max) {
        List<Post> posts = new ArrayList<>();
        if (min == null && max == null) {
            posts = postRepository.findPublicPosts(limit);
        } else if (min != null) {
            posts = postRepository.findOlderPost(min, limit);
        } else {
            posts = postRepository.findNewerPost(max, limit);
        }

        int uid = sessionService.readIntByKey("uid");
        for (Post post: posts) {
            int pid = post.getPid();
            if (post.getHasAttachments() > 0) {
                post.setAttachments(attachmentService.signPostAttachments(pid));
            }
            if (uid > 0) {
                post.setMarked(markService.checkMarked(uid, pid));
                if (postRepository.findAuthorByPost(pid) == uid) {
                    post.setOwner(true);
                }
            }
        }

        // if the path variable contains no 'max', check whether it has older post.
        PostResponse postResponse = new PostResponse(posts, postRepository);
        if (max == null) postResponse.checkMorePosts(postRepository);
        return postResponse;
    }

    @PostMapping(path = {"", "/"})
    @Transactional
    public String sendPost(@RequestBody PostRequest postRequest) {
        Post post = new Post(postRequest);
        if (postRequest.getAnonymous()) {
            post.setUname("Anonymous");
        }
        post = postRepository.save(post);
        if (post.getUid() > 0) {
            User user = userRepository.findByUid(post.getUid());
            user.setPosts(user.getPosts() + 1);
            userRepository.save(user);
        }
        if (postRequest.getImage() != null && postRequest.getImage().length() > 0) {
            attachmentService.processImage(postRequest, post.getPid());
            post.setHasAttachments(1);
            postRepository.save(post);
        }

        return "Success";
    }

    @DeleteMapping(path = "/{pid}")
    @Auth(value = "logged")
    @Transactional
    public String delelePost(@PathVariable Integer pid, HttpServletResponse response) {
        Post post = postRepository.findByPid(pid);
        if (post == null) {
            throw new GenericError("Cannot find post.");
        }
        int uid = sessionService.readIntByKey("uid");
        if (uid != post.getUid()) {
            throw new AuthError("Only the author of the post is allowed to delete it.");
        }

        // The post status is set to -1 when it's deleted, so can hide it instead of delete it from all user's mark list.
        post.setStatus(-1);
        postRepository.save(post);
        // user posts count minus 1.
        User user = userRepository.findByUid(uid);
        user.setPosts(Math.max(user.getPosts() - 1, 0));
        userRepository.save(user);
        return "Success";
    }

    // TODO: wait for postPost method complete.
    @GetMapping(path = {"user/{uid}", "user/{uid}/{page}"})
    @Auth(value = "owner")
    public void getUserPost(@RequestParam Integer uid, @RequestParam(required = false) Integer page) {
        if (page == null || page < 0) page = 0;
        Pageable pageable = PageRequest.of(page, limit);
        Page<Post> posts = postRepository.findByUid(uid, pageable);
        System.out.println(posts);
    }

}
