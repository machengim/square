import { Component, OnInit } from '@angular/core';
import { Post, PostList } from '../models';
import { SquareService } from '../square.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[];
  min = -1;
  max = -1;
  hasNew = false;
  hasMore = false;

  constructor(private squareService: SquareService) { }

  // Cookie setting is temporarily put here. 
  // It should be removed after the implementation of user authentication.
  ngOnInit(): void {
    this.getPostList();
  }

  getPostList(): void {
    this.squareService.getPosts()
      .subscribe(data => this.handlePostsResponse(data, 0));
  }

  handlePostsResponse(data: PostList, op: number) : void {
    if (data.posts == null) return;

    if (this.posts == null) {
      this.posts = data.posts;
    } else if (op == -1) {
      this.posts = this.posts.concat(data.posts);
    } else if (op == 1) {
      this.posts = data.posts.concat(this.posts);
    }
    
    if (this.min < 0 || this.min > data.min) {
      this.min = data.min;
    }

    if (this.max < 0 || this.max < data.max) {
      this.max = data.max;
    }
    this.hasNew = data.hasNew;
    this.hasMore = data.hasMore;
  }

  loadMore(): void {
    this.squareService.getPostsWithOffset("min", this.min)
        .subscribe(data => this.handlePostsResponse(data, -1));
  }

  loadNew(): void {
    this.squareService.getPostsWithOffset("max", this.max)
        .subscribe(data => this.handlePostsResponse(data, 1));
  }

  // This implementation is not ideal.
  // The real comments number should be retrieved from database later.
  onNewComment(pid: number): void{
    for (let post of this.posts){
      if (post.id == pid) {
        post.comments += 1;
      }
    }
  }
}
