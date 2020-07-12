import { Component, OnInit, HostListener } from '@angular/core';
import { SquareService } from '../square.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  keyword = "";

  constructor(
    private router: Router,
    private squareService: SquareService) { }

  ngOnInit(): void {
  }

  logout(): void {
    if (confirm("Quit?")) {
      this.squareService.logout()
          .subscribe(res => this.router.navigate(['/login']));
      }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.keyword = this.keyword.trim();
    if (this.keyword == "") {
      return;
    }
    this.router.navigate(['./search/' + this.keyword]);
    this.squareService.changeKeyword(this.keyword);
    this.keyword = "";
  }
}
