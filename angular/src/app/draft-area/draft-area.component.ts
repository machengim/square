import { Component, OnInit } from '@angular/core';
import { Draft } from '../models'; 
import { SquareService } from '../square.service';

@Component({
  selector: 'app-draft-area',
  templateUrl: './draft-area.component.html',
  styleUrls: ['./draft-area.component.css']
})
export class DraftAreaComponent implements OnInit {

  selected = false;

  draft: Draft;

  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
    this.initDraft();
  }

  initDraft(): void {
    this.draft = {
      uid: -1,
      nickname: "",
      content: "",
      isAnonymous: false,
      isPrivate: false,
    }
  }

  switchSelected(): void {
    this.selected = !this.selected;
  }

  submitDraft(): void {
    console.log(this.draft);
    this.squareService.postDraft(this.draft);
    this.initDraft();
    this.selected = false;
  }
}
