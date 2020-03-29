import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Draft, Post } from '../models'; 
import { SquareService } from '../square.service';

@Component({
  selector: 'app-draft-area',
  templateUrl: './draft-area.component.html',
  styleUrls: ['./draft-area.component.css']
})
export class DraftAreaComponent implements OnInit {

  @Output() submitted = new EventEmitter<boolean>();
  selected = false;
  draft: Draft;
  post: Post;   // Used to generate a temporaral post from the draft.
  selectedFile: File;
  btn_text: string;

  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
    this.initDraft();
    this.resetBtnText();
  }

  initDraft(): void {
    this.draft = {
      uid: -1,   // This field should be set to the user's id later.
      nickname: "", // Should be set to user's nickname later.
      content: "",
      isAnonymous: false,
      isPrivate: false,
      img: "",
    }
  }

  resetBtnText(): void {
    this.btn_text = "Choose an image..";
  }

  generatePost(): void {
    let [uid, nickname] = this.squareService.getUserInfoFromCookie();
    if (this.draft.isAnonymous || nickname == "") nickname = "Anonymous";

    this.post = {
      id: -1,
      ts: "",
      uid: uid,
      nickname: nickname,
      isPrivate: this.draft.isPrivate,
      comments: 0,
      content: this.draft.content,
      hasNewComments: false,
      mid: -1,
      img: this.draft.img,
    }
  }

  switchSelected(focus: boolean): void {
    this.selected = focus;
  }


  submitDraft(): void {
    if (this.draft.content.trim() == "" && this.selectedFile == null) {
      alert("No content.");
      return;
    }

    if (this.selectedFile == null) {
      this.generatePost();
      this.squareService.postDraft(this.post)
      .subscribe(data => this.handleSubmitRes());
    } else {
      let myReader = new FileReader();
      myReader.readAsDataURL(this.selectedFile);
      myReader.onloadend = (e) => {
        this.draft.img = String(myReader.result);
        this.generatePost();
        this.squareService.postDraft(this.post)
            .subscribe(data => this.handleSubmitRes());
      }
    }

  }

  handleSubmitRes(): void {
    this.selected = false;
    this.initDraft();
    this.resetBtnText();
    this.submitted.emit(true);
    this.squareService.draftSent();
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile == null) {
      this.resetBtnText();
      return;
    }

    let name = this.selectedFile.name;
    if (name.length > 20) {
      name = name.slice(-20, );
    } 

    this.btn_text = name;
  }

}
