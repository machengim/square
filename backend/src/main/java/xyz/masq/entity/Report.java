package xyz.masq.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.Instant;

@Entity
@Getter @Setter
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rid;
    private int uid;
    private int pid;
    // 0 means haven't processed; 1 means report is valid and the author got warned;
    // 2 means report is valid and the author got blocked;
    // -1 means the post has no problem.
    private int action = 0;
    // Request comes with the report.
    private String request;
    // Reply back to the reporting user.
    private String reply;
    // The create time of this report.
    private Instant ctime;
    // The reply time.
    private Instant rtime;

    public Report() {}

    public Report(int pid, String request, int uid) {
        this.pid = pid;
        this.request = request;
        this.uid = uid;
        this.ctime = Instant.now();
    }
}
