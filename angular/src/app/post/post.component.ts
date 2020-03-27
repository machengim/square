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
  @Output() removePost = new EventEmitter<number>();

  owned = false;

  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
    let [uid, _] = this.squareService.getUserInfoFromCookie();
    if (uid == this.post.uid) {
      this.owned = true;
    }
  }

  // This function handle the signal of new comment from child component,
  // and then report it to parent.
  onSubmitComment(submit: boolean) {
    this.newComment.emit(this.post.id);
  }

  markPost(): void {
    this.squareService.postMark(this.post.id)
        .subscribe(res => { this.post.mid = res; this.squareService.draftSent() });
  }

  unmarkPost():void {
    this.squareService.deleteMark(this.post.mid)
        .subscribe(res => { this.post.mid = -1; this.squareService.draftSent(); })
  }

  deletePost(): void {
    if (confirm("Confirm to delete it?")) {
      this.removePost.emit(this.post.id);
    }
  }
}
