import { Component, OnInit } from '@angular/core';
import { Post, PostList } from '../models';
import { SquareService } from '../square.service';
import { webSocket } from 'rxjs/webSocket';

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
  subject = null;

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
    if (data.posts == null) {
      this.hasMore = false; return;
    }
    for (let post of data.posts) {
      if (post.img.length > 0) {
        post.img = 'http://localhost/' + post.img
      }
    }
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

    if (op == 1) {
      this.hasNew = false;
    } else {
      this.hasMore = data.hasMore;
    }
    this.getNotification();
  }

  loadMore(): void {
    this.squareService.getPostsWithOffset("min", this.min)
        .subscribe(data => this.handlePostsResponse(data, -1));
  }

  loadNew(): void {
    this.cancleWebsocket();
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

  onDeletePost(pid: number): void {
    this.posts = this.posts.filter(item => item.id != pid);
    this.squareService.deletePost(pid)
        .subscribe(res => {this.squareService.refreshInfo.emit(true)});
  }

  getNotification(): void {
    let url = 'ws://localhost:8080/newPosts'
    this.subject = webSocket(url);

    this.subject.subscribe(
      msg => { 
        console.log(msg);
        this.hasNew = true; },
      err => { console.log(err); }
    );

    this.subject.next(this.max);
  }

  cancleWebsocket(): void {
    if (this.subject != null) {
      this.subject.complete();
    }
  }
}
