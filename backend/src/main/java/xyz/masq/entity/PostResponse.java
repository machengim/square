package xyz.masq.entity;

import lombok.Data;
import xyz.masq.repository.PostRepository;

import java.util.List;

@Data
public class PostResponse {
    private boolean hasMore = false;
    private int maxPid;
    private int minPid;
    private List<Post> posts;

    // TODO: check posts owner and whether it's marked by current user.
    public PostResponse(List<Post> posts, PostRepository postRepository) {
        this.posts = posts;
        if (this.posts.size() == 0) return;

        setMaxMin();
        checkMorePosts(postRepository);
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

    private void checkMorePosts(PostRepository postRepository) {
        List<Post> morePosts = postRepository.checkMorePosts(this.minPid);
        if (morePosts.size() > 0) {
            this.hasMore = true;
        }
    }
}
