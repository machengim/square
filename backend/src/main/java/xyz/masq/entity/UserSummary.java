package xyz.masq.entity;

import lombok.Data;

@Data
public class UserSummary {
    private int uid;
    private String email;
    private String uname = "Anonymous";
    private int posts = 0;
    private int marks = 0;
    private int messages = 0;
    private int type = -1;

    public UserSummary(User user) {
        this.uid = user.getUid();
        this.email = user.getEmail();
        this.uname = user.getUname();
        this.posts = user.getPosts();
        this.marks = user.getMarks();
        this.type = user.getType();
        this.messages = user.getMessages();
    }
}
