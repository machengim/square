import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Post } from '../models';
import { PostListComponent } from '../post-list/post-list.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit, AfterViewInit {

  @ViewChild(PostListComponent)
  private postList: PostListComponent;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmitted(post: Post) {
    this.postList.loadNew();
  }

  ngAfterViewInit() {
  }
}
