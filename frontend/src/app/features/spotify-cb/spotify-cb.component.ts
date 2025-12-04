import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spotify-cb',
  templateUrl: './spotify-cb.component.html',
})
export class SpotifyCbComponent implements AfterViewInit {
  @ViewChild('welcomeScreen') welcomeScreen!: ElementRef<HTMLDivElement>;
  @ViewChild('welcomeText') welcomeText!: ElementRef<HTMLHeadingElement>;
  @ViewChild('logoWrapper') logoWrapper!: ElementRef<HTMLDivElement>;

  constructor(private router: Router) {}

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
      this.router.navigate(['/dashboard']);
    }, 4000);
  }
}
