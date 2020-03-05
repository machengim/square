import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SquareService } from '../square.service';
import { Post, PagedList } from '../models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  op = -1;
  posts: Post[];
  current = -1;
  total = -1;
  pages: number[];
  changing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private squareService: SquareService
  ) {}

  ngOnInit(): void {
    this.posts = [];
    let url = this.route.snapshot.paramMap.get('op');
    this.getPrivatePosts(url);
    this.squareService.refreshUser
        .subscribe(url => this.refresh(url));
  }

  refresh(url: string): void {
    this.posts = [];
    this.getPrivatePosts(url);
  }

  getPrivatePosts(url: string): void {
    switch (url) {
      case "comments":
        this.op = -1;
        break;
      case "marks":
        this.op = 1;
        break;
      default:
        this.op = 0
        break;
    }
    this.squareService.getPrivatePost(this.op, 1)
        .subscribe(data => this.handlePostsResponse(data));
  }

  handlePostsResponse(data: PagedList): void {
    if (this.total <=0 && data.total > 0) {
      this.total = data.total;
    }
    this.posts = data.posts;
    if (this.current < 1) {
      this.current = 1;
    }
    this.buildPageArray();
  }

  buildPageArray(): void {
    this.pages = new Array<number>();
    for (let i = 1; i <= this.total; i++) {
      this.pages.push(i);
    }
  }

  turnPage(page: number): void {
    this.current = page;
    this.squareService.getPrivatePost(this.op, page)
        .subscribe(data => this.handlePostsResponse(data));
  }

}
