package xyz.masq.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pid;
    private int uid;
    private String uname;
    private String content;
    Instant ctime = Instant.now();
    private int comments = 0;
    // this field saves the aid of attachment currently.
    private int hasAttachments = 0;
    // 0 means private, 1 means public, -1 means deleted,
    // -2 means under report, 99 means trusted.
    private int status = 1;
    @Transient
    private boolean marked = false;
    @Transient
    private boolean owner = false;
    @Transient
    private List<Attachment> attachments;

    public Post() { }

    public Post(PostRequest request) {
        this.uid = request.getUid();
        this.uname = request.getUname();
        this.content = request.getContent();
        this.ctime = request.getCtime();
        this.status = request.getStatus();
    }
}
