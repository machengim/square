import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SquareService } from '../square.service';
import { error } from 'protractor';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email = "";
  password = "";
  repeatPw = "";
  nickname = "";

  constructor(
    private router: Router,
    private squareService: SquareService) { }

  ngOnInit(): void {
  }

  register(): void {
    console.log('nickname is ', this.nickname);
    if (this.password != this.repeatPw) {
      alert("Passwords not match!");
      return;
    }

    this.squareService.register(this.email, this.password, this.nickname)
        .subscribe(data => {
          if (confirm("Register successfully!")) {
            this.backToLogin();
          }
        },
        error => alert(error.error))
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

}
