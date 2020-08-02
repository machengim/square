package xyz.masq.entity;

import lombok.Data;

import java.time.Instant;

@Data
public class PostRequest {
    private int uid;
    private String uname;
    private String content;
    private Instant ctime = Instant.now();
    private int isPrivate = 0;
    private String image;
}
