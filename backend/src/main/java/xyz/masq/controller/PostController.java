package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.masq.repository.PostRepository;
import xyz.masq.entity.Post;
import xyz.masq.entity.PostResponse;

import java.util.List;

@PropertySource("classpath:site.properties")
@RestController
@Slf4j
@RequestMapping(path = "/posts")
public class PostController {

    @Value("${site.page.limit}")
    private int limit;

    @Autowired
    PostRepository postRepository;

    @GetMapping(path = {"", "/"})
    public PostResponse getPublicPosts() {
        List<Post> posts = postRepository.findPublicPosts(limit);
        return new PostResponse(posts, postRepository);
    }
}
