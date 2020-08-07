package xyz.masq.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.masq.entity.Comment;
import xyz.masq.entity.CommentResponse;
import xyz.masq.entity.Post;
import xyz.masq.error.GenericError;
import xyz.masq.repository.CommentRepository;
import xyz.masq.repository.PostRepository;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping(path = "/comments")
public class CommentController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @GetMapping(path = "/{pid}")
    public CommentResponse getComments(@PathVariable Integer pid) {

        List<Comment> comments = commentRepository.findAllByPid(pid);
        CommentResponse commentResponse = new CommentResponse();
        commentResponse.setComments(comments);
        return commentResponse;
    }

    @PostMapping(path = "/{pid}")
    @Transactional
    public Comment postComment(@PathVariable Integer pid, @RequestBody Comment comment) {
        if (comment.getContent().trim().length() == 0) {
            throw new GenericError("No content in the comment.");
        }

        Post post = postRepository.findByPid(pid);
        if (post == null) {
            throw new GenericError("Cannot find the post with pid: " + pid);
        }

        comment = commentRepository.save(comment);
        post.setComments(post.getComments() + 1);
        postRepository.save(post);

        return comment;
    }
}
