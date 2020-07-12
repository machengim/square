import { Component, OnInit, HostListener } from '@angular/core';
import { User } from '../models';
import { SquareService } from '../square.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  changing = false;
  newNickname: string;

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

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.changing = false;
    this.newNickname = this.user.nickname;
  }
  
  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
    this.refresh();
    this.squareService.refreshInfo
        .subscribe(sig => this.refresh());
  }

  refresh(): void{
    this.readInfoFromCookie();
    this.getUserInfo();
  }

  getUserInfo(): void {
    if (this.user.id <= 0) this.user.id = 1;
    this.squareService.getUserInfo(this.user.id)
        .subscribe(data => this.handleUserInfo(data));
  }

  handleUserInfo(data: User): void {
    this.user = data;
    this.newNickname = this.user.nickname;
    // Comment this line to debug.
    //this.squareService.setCookie(this.user.id, this.user.nickname);
  }

  readInfoFromCookie(): void {
    [this.user.id, this.user.nickname] = this.squareService.getUserInfoFromCookie();
  }

  clickChang(): void {
    this.changing = true;
  }

  clickSubmit(): void {
    this.user.nickname = this.newNickname;
    this.squareService.putUserInfo(this.user)
        .subscribe(data => this.getUserInfo());
    this.changing = false;
  }

  urlChange(url: string): void {
    this.squareService.userSectionChange(url);
  }
}
