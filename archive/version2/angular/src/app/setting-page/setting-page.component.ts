import { Component, OnInit } from '@angular/core';
import { SquareService } from '../square.service';
import { User } from '../models';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {

  newNickname: string;
  newPassword: string;
  newPasswordRepeat: string;

  user: User = {
    id: -1,
    password: "",
    email: "",
    nickname: "",
    posts: 0,
    comments: 0,
    marks: 0,
    messages: 0
  };

  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
    this.readInfoFromCookie();
    this.getUserInfo();
  }

  readInfoFromCookie(): void {
    [this.user.id, this.user.nickname] = this.squareService.getUserInfoFromCookie();
  }

  getUserInfo(): void {
    if (this.user.id <= 0) this.user.id = 1;
    this.squareService.getUserInfo(this.user.id)
        .subscribe(data => this.handleUserInfo(data));
  }

  handleUserInfo(data: User): void {
    this.user = data;
    this.newNickname = this.user.nickname;
  }

  submitChange(): void {
    if (this.newPassword != this.newPasswordRepeat) {
      alert("Passwords not match.");  return;
    }
    this.user.nickname = this.newNickname;
    this.squareService.putUserInfo(this.user)
        .subscribe(data => this.handleSubmitResponse());
  }

  handleSubmitResponse(): void {
    this.getUserInfo();
    alert("Change successfully.");
  }

  reset(): void {
    this.newNickname = this.user.nickname;
    this.newPassword = "";
    this.newPasswordRepeat = "";
  }
}
