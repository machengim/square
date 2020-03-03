import { Component, OnInit, Output } from '@angular/core';
import { Draft, Post } from '../models'; 
import { SquareService } from '../square.service';

@Component({
  selector: 'app-draft-area',
  templateUrl: './draft-area.component.html',
  styleUrls: ['./draft-area.component.css']
})
export class DraftAreaComponent implements OnInit {

  selected = false;
  draft: Draft;
  post: Post;   // Used to generate a temporaral post from the draft.

  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
    this.initDraft();
  }

  initDraft(): void {
    this.draft = {
      uid: 1,   // This field should be set to the user's id later.
      nickname: "", // Should be set to user's nickname later.
      content: "",
      isAnonymous: false,
      isPrivate: false,
    }
  }

  generatePost(): void {
    this.post = {
      id: -1,
      ts: "",
      uid: this.draft.uid,
      nickname: this.draft.nickname,
      isPrivate: this.draft.isPrivate,
      comments: 0,
      content: this.draft.content,
      hasNewComments: false
    }
  }

  switchSelected(): void {
    this.selected = !this.selected;
  }

  submitDraft(): void {
    this.generatePost();
    this.squareService.postDraft(this.post)
        .subscribe(data => { this.selected = false; this.initDraft(); });
  }

}
