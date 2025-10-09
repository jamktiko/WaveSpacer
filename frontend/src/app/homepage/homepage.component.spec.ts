import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomepageComponent, // standalone-komponentti
        RouterTestingModule, // antaa ActivatedRoute ja Router
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1️⃣ Komponentin luonti
  it('should create the homepage component', () => {
    expect(component).toBeTruthy();
  });

  // 2️⃣ Otsikon renderöinti
  it('should render title "WaveSpacer" inside h1 tag', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('WaveSpacer');
  });

  // 3️⃣ Register-nappi näkyy
  it('should have a Register button', () => {
    const button = fixture.nativeElement.querySelector('a button');
    expect(button?.textContent).toContain('Register');
  });

  // 4️⃣ Spotify login -funktion kutsu
  it('should call login() when Spotify button is clicked', () => {
    spyOn(component, 'login'); // seuraa login-metodia
    const spotifyButton = fixture.debugElement.query(
      By.css('button.flex.items-center.justify-center.bg-[#1ED760]')
    );
    spotifyButton.nativeElement.click();
    expect(component.login).toHaveBeenCalled();
  });
});
