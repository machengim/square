import { Component, OnInit } from '@angular/core';
import { User } from '../models';
import { SquareService } from '../square.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

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

  getUserInfo(): void {
    if (this.user.id <= 0) return;
    this.squareService.getUserInfo(this.user.id)
        .subscribe(data => this.handleUserInfo(data));
  }

  handleUserInfo(data: User): void {
    this.user = data;
    console.log(data);
  }

  readInfoFromCookie(): void {
    [this.user.id, this.user.nickname] = this.squareService.getUserInfoFromCookie();
  }

}
