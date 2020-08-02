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
import xyz.masq.repository.PostRepository;
import xyz.masq.entity.Post;
import xyz.masq.entity.PostResponse;
import xyz.masq.service.AttachmentService;

import javax.transaction.Transactional;
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
    private AttachmentService attachmentService;

    @GetMapping(path = {"", "/"})
    public PostResponse getPublicPosts() {
        List<Post> posts = postRepository.findPublicPosts(limit);
        return new PostResponse(posts, postRepository);
    }

    // TODO: generate thumbnail, save image file, convert PostRequest to Post.
    @PostMapping(path = {"", "/"})
    @Transactional
    public String sendPost(@RequestBody PostRequest postRequest) {
        Post post = new Post(postRequest);
        post = postRepository.save(post);
        int aid = attachmentService.processImage(postRequest, post.getPid());
        post.setAttachments(aid);
        postRepository.save(post);

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
