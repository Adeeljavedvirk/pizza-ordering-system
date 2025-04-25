import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cpa-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  moveToMenu() {
    this.router.navigateByUrl('/order');
  }
}
