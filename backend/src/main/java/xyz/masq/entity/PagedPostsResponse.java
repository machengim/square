package xyz.masq.entity;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PagedPostsResponse {

    private int currentPage;
    private int totalPage;
    private List<Post> posts;

    public PagedPostsResponse(Page<Post> postPage, int page) {
        currentPage = page;
        totalPage = postPage.getTotalPages();
        posts = postPage.toList();
    }
}
