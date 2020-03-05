import { Component } from '@angular/core';
import { SquareService } from './square.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';

  constructor(private squareService: SquareService){
    let [id, _] = this.squareService.getUserInfoFromCookie();
    if (id <= 0) {
      //window.location.href="./login.html";
    }
  }


}
