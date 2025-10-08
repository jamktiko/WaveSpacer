import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

//aws testi push kommentti 7

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
    location.href = `${environment.apiUrl}login`;
  }
}
