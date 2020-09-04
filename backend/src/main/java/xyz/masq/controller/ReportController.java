package xyz.masq.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.masq.entity.Post;
import xyz.masq.entity.Report;
import xyz.masq.entity.ReportRequest;
import xyz.masq.error.GenericError;
import xyz.masq.repository.PostRepository;
import xyz.masq.repository.ReportRepository;
import xyz.masq.service.SessionService;

import javax.transaction.Transactional;

@RestController
@Slf4j
@RequestMapping(path = "/report")
public class ReportController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PostRepository postRepository;

    // Note transaction annotation is on the child method.
    @PostMapping(path = {"", "/"})
    public String sendReport(@RequestBody ReportRequest reportRequest) {
        int pid = reportRequest.getPid();
        String request = reportRequest.getRequest();
        checkPostHistory(pid);
        addReport(pid, request);

        return "Report recorded.";
    }

    @PostMapping(path = "/{pid}")
    public String sendReportWithPid(@PathVariable Integer pid) {
        checkPostHistory(pid);
        addReport(pid, null);

        return "Report recorded.";
    }

    private void checkPostHistory(int pid) {
        Post post = postRepository.findByPid(pid);
        if (post.getStatus() == 99) {
            throw new GenericError("Sorry, this post had been checked before and it seems alright. " +
                    "If you insist, please check our report page.");
        }
    }

    @Transactional
    private void addReport(int pid, String request) {
        Post post = postRepository.findByPid(pid);
        post.setStatus(-2);
        postRepository.save(post);

        int uid = sessionService.readIntByKey("uid");
        Report report = new Report(pid, request, uid);
        reportRepository.save(report);
    }
}
