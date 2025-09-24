import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {
  constructor() {}

  title = 'WaveSpacer';

  login() {
    location.href = 'http://127.0.0.1:8888/login';
  }
}
