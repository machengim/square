import { Component, OnInit } from '@angular/core';
import { SquareService } from '../square.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private squareService: SquareService) { }

  ngOnInit(): void {
  }

  logout(): void {
    if (confirm("Quit?")) {
      this.squareService.logout()
          .subscribe(res => window.location.href='../login.html');
      }
  }
}
