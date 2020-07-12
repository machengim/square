import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SquareService } from '../square.service';
import { Post, PagedList } from '../models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  posts: Post[] = [];
  current = -1;
  total = -1;
  pages: number[];
  keyword = "";

  constructor(
    private route: ActivatedRoute,
    private squareService: SquareService
  ) { }
  
  ngOnInit(): void {
    // The first time it searches using the param in the url.
    if (this.current <= 0) {
      this.keyword = this.route.snapshot.paramMap.get('keyword');
      this.getSearchPosts(this.keyword, this.current);
    }
    // Otherwise it waits for the keyword change.
    this.squareService.refreshKeyword
        .subscribe(newkey => this.refresh(newkey));
  }

  getSearchPosts(keyword: string, page: number): void {
    this.squareService.getSearchPosts(keyword, page)
        .subscribe(data => this.handleSearchResults(data));
  }

  refresh(newkey: string): void {
    this.keyword = newkey;
    this.getSearchPosts(this.keyword, this.current);
  }

  handleSearchResults(data: PagedList): void {
    console.log(data);
    this.posts = [];
    if (data.total > 0) {
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
    this.squareService.getSearchPosts(this.keyword, page)
        .subscribe(data => this.handleSearchResults(data));
  }

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

}
