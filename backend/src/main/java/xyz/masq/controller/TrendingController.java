package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import xyz.masq.entity.Post;
import xyz.masq.entity.PostResponse;
import xyz.masq.service.AttachmentService;
import xyz.masq.service.MarkService;
import xyz.masq.service.SessionService;
import xyz.masq.service.TrendingService;

import java.util.List;

@RestController
@Slf4j
@RequestMapping(path = "/trending")
public class TrendingController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private TrendingService trendingService;

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private MarkService markService;

    @GetMapping(path = {"", "/"})
    public PostResponse getTreanding(@RequestParam (required = false) Integer days) {
        if (days == null) days = 1;
        List<Post> posts = trendingService.findTrendingPost(days);

        int uid = sessionService.readIntByKey("uid");
        for (Post post: posts) {
            int pid = post.getPid();
            if (post.getHasAttachments() > 0) {
                post.setAttachments(attachmentService.signPostAttachments(pid));
            }
            if (uid > 0) {
                post.setMarked(markService.checkMarked(uid, pid));
            }
        }

        return new PostResponse(posts);
    }

}
