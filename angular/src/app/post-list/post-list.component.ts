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
    this.squareService.setCookie(1, "Walt White");
  }

  getPostList(): void {
    this.squareService.getPosts()
      .subscribe(data => this.handlePostsResponse(data));
  }

  handlePostsResponse(data: PostList) : void {
    if (this.posts == null) {
      this.posts = data.posts;
    } else {
      this.posts.concat(data.posts);
    }
    
    if (this.min < 0 || this.min > data.min) {
      this.min = data.min;
    }

    if (this.max < 0 || this.max < data.max) {
      this.max = data.max;
    }
    this.hasNew = data.hasNew;
    this.hasMore = data.hasMore;
    console.log(data);
  }

  loadMore(): void {
    this.squareService.getPostsWithOffset("min", this.min)
        .subscribe(data => this.handlePostsResponse(data));
  }

  loadNew(): void {
    this.squareService.getPostsWithOffset("max", this.max)
        .subscribe(data => this.handlePostsResponse(data));
  }
}
