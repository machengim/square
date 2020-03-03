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
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.squareService.getUserInfo(1)
        .subscribe(data => this.handleUserInfo(data));
  }

  handleUserInfo(data: User): void {
    this.user = data;
    console.log(data);
  }

}
