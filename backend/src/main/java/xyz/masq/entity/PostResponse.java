package xyz.masq.entity;

import lombok.Data;
import xyz.masq.repository.PostRepository;

import java.util.List;

@Data
public class PostResponse {
    private Boolean hasMore;
    private int maxPid;
    private int minPid;
    private List<Post> posts;

    // TODO: check posts owner and whether it's marked by current user.
    public PostResponse(List<Post> posts) {
        this.posts = posts;
        if (this.posts.size() == 0) return;

        setMaxMin();
    }

    private void setMaxMin() {
        int max = -1, min = -1;
        for (Post p: this.posts) {
            int pid = p.getPid();
            max = Math.max(max, pid);
            min = (min < 0 || min > pid)? pid: min;
        }

        this.maxPid = max;
        this.minPid = min;
    }

    public void checkMorePosts(PostRepository postRepository) {
        List<Post> morePosts = postRepository.checkMorePosts(this.minPid);
        this.hasMore = morePosts.size() > 0;
    }
}
