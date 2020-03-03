import { Component, OnInit, Input } from '@angular/core';
import { Post, Comment } from '../models';
import { SquareService } from '../square.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() post: Post;
  comments: Comment[];
  comment: Comment;
  show = false;

  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
    this.initComment();
  }

  initComment(): void {
    this.comment = {
      id: -1,
      ts: "",
      uid: 1,
      nickname: "",
      pid: this.post.id,
      content: "",
    }
  }

  getComments(): void {
    this.squareService.getComments(this.post.id)
        .subscribe(data => {this.comments = data; console.log(this.comments)});
  }

  submitComment(): void {
    console.log(this.comment)
    this.squareService.postComment(this.comment)
        .subscribe(data => this.initComment());
  }

  switchShow(): void {
    this.show = !this.show;
    if (this.show) { this.getComments(); }
  }
}
