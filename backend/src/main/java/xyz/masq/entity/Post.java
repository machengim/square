package xyz.masq.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;

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
    private int attachments = 0;
    // 0 means public, 1 means private, maybe more options later.
    @Column(name = "isPrivate")
    private int isPrivate = 0;
    @Transient
    private boolean marked = false;
    @Transient
    private boolean owner = false;

    public Post(PostRequest request) {
        this.uid = request.getUid();
        this.uname = request.getUname();
        this.content = request.getContent();
        this.ctime = request.getCtime();
        this.isPrivate = request.getIsPrivate();
    }
}
