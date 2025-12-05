import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-spotify-cb',
  templateUrl: './spotify-cb.component.html',
})
export class SpotifyCbComponent implements AfterViewInit {
  @ViewChild('welcomeScreen') welcomeScreen!: ElementRef<HTMLDivElement>;
  @ViewChild('welcomeText') welcomeText!: ElementRef<HTMLHeadingElement>;
  @ViewChild('logoWrapper') logoWrapper!: ElementRef<HTMLDivElement>;

  private callbackSucceeded = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (!code) {
      this.router.navigate(['']);
      return;
    }

    axios
      .get(`${environment.apiUrl}api/callback?code=` + code, {
        withCredentials: true,
      })
      .then(() => {
        this.callbackSucceeded = true;
      })
      .catch((err) => {
        console.warn(err);
        this.router.navigate(['']);
      });
  }

  ngAfterViewInit(): void {
    this.startWelcomeAnimation();
  }

  startWelcomeAnimation() {
    this.welcomeScreen.nativeElement.classList.remove('hidden');

    setTimeout(() => {
      this.welcomeText.nativeElement.classList.remove('opacity-0', 'scale-90');
    }, 300);

    setTimeout(() => {
      this.logoWrapper.nativeElement.classList.remove('opacity-0', 'scale-90');
    }, 2000);

    setTimeout(() => {
      if (this.callbackSucceeded) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['']);
      }
    }, 4000);
  }
}
