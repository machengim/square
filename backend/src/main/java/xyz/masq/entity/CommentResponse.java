package xyz.masq.entity;

import lombok.Data;

import java.util.List;

@Data
public class CommentResponse {

    private List<Comment> comments;
}
