import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SquareService } from '../square.service';
import { Post } from '../models';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  @Output() newComment = new EventEmitter<number>();
  markid = -1;

  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
  }

  // This function handle the signal of new comment from child component,
  // and then report it to parent.
  onSubmitComment(submit: boolean) {
    this.newComment.emit(this.post.id);
  }

  markPost(): void {
    this.squareService.postMark(this.post.id)
        .subscribe(res => { this.markid = res; console.log(res)});
  }
}
