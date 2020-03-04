import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post, Comment } from '../models';
import { SquareService } from '../square.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() post: Post;
  @Output() submitted = new EventEmitter<boolean>();
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
      uid: -1,
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
    let [uid, nickname] = this.squareService.getUserInfoFromCookie();
    if (nickname == "") nickname = "Anonymous";
    this.comment.uid = uid;
    this.comment.nickname = nickname;
    
    this.squareService.postComment(this.comment)
        .subscribe(data => this.handleSubmit());
  }

  handleSubmit(): void{
    this.submitted.emit(true);
    this.initComment();
    this.getComments();
  }

  switchShow(): void {
    this.show = !this.show;
    if (this.show && this.comments == null) { this.getComments(); }
  }
}
