import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistcleanComponent } from './playlistclean.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('PlaylistcleanComponent', () => {
  let component: PlaylistcleanComponent;
  let fixture: ComponentFixture<PlaylistcleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistcleanComponent],
      providers: [
        provideRouter([]), // fake router testejä varten
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistcleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 🔹 Testi 1: Komponentti luodaan
  it('should create the playlistclean componenet', () => {
    expect(component).toBeTruthy();
  });

  // 🔹 Testi 2: Pääotsikko renderöityy oikein.
  it('should render main heading "Choose the songs to be deleted"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = compiled.querySelectorAll('h1');
    const mainHeading = headings[1];
    expect(mainHeading?.textContent?.trim()).toContain('Choose the');
    expect(mainHeading?.textContent).toContain('songs');
  });

  // 🔹 Testi 3: Logo näkyy ja sillä on oikea src
  it('should display logo image with correct src', () => {
    const logo = fixture.debugElement.query(By.css('img[alt="Logo"]'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.src).toContain('/images/logo.png');
  });

  // 🔹 Testi 4: Profiilikuva näkyy
  it('should display profile picture', () => {
    const profilePic = fixture.debugElement.query(
      By.css('img[alt="profilepic"]')
    );
    expect(profilePic).toBeTruthy();
  });

  // 🔹 Testi 5: Playlistin kuva näkyy
  it('should display selected playlist image', () => {
    const playlistImg = fixture.debugElement.query(
      By.css('img[alt="playlist img"]')
    );
    expect(playlistImg).toBeTruthy();
  });

  // 🔹 Testi 6: Komponentissa on routerLink "/"
  it('should have a routerLink to "/" on the logo link', () => {
    const routerLink = fixture.debugElement.query(
      By.css('a[routerLink="/dashboard"]')
    );
    expect(routerLink).toBeTruthy();
  });
});
