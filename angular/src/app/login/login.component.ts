import { Component, OnInit } from '@angular/core';
import { SquareService } from '../square.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(
    private squareService: SquareService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.squareService.login(this.email, this.password)
        .subscribe(
          data => {
            this.squareService.newLogin();
            this.router.navigate(['/home'])
          },
          error=> alert(error.error),
          );
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

}
