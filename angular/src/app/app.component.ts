import { Component } from '@angular/core';
import { SquareService } from './square.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';
  show = true;

  constructor(
    private squareService: SquareService,
    private router: Router) {
      let [id, _] = this.squareService.getUserInfoFromCookie();
      if (id <= 0) {
        this.router.navigate(['/login']);
        this.show = false;
      } else {
        this.router.navigate(['/home']);
      }

      this.squareService.refreshLogin
          .subscribe(isLogin => this.show = isLogin);
  }

}
