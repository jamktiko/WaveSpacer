import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  // Mock stores
  const mockProfileStore = {
    getProfile: jasmine.createSpy('getProfile'),
    profilepic: jasmine
      .createSpy('profilepic')
      .and.returnValue('/images/profile.jpg'),
    display_name: jasmine.createSpy('display_name').and.returnValue('John Doe'),
    email: jasmine.createSpy('email').and.returnValue('john@example.com'),
  };

  const mockUiStore = {
    title: jasmine.createSpy('title').and.returnValue('WaveSpacer'),
    toggleDropdownVisibility: jasmine.createSpy('toggleDropdownVisibility'),
    dropdownvisible: jasmine
      .createSpy('dropdownvisible')
      .and.returnValue(false),
    closeDropdown: jasmine.createSpy('closeDropdown'),
  };

  const mockSettingStore = {
    background: jasmine.createSpy('background').and.returnValue(''),
    turnOnLightMode: jasmine.createSpy('turnOnLightMode'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, RouterTestingModule],
      providers: [
        { provide: 'profileStore', useValue: mockProfileStore },
        { provide: 'uiStore', useValue: mockUiStore },
        { provide: 'settingStore', useValue: mockSettingStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the profile component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with title from uiStore', () => {
    expect(component.title).toBe('WaveSpacer');
  });

  it('should not call turnOnLightMode when localStorage has lightmode false', () => {
    spyOn(localStorage, 'getItem').and.returnValue('false');

    const newFixture = TestBed.createComponent(ProfileComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(mockSettingStore.turnOnLightMode).not.toHaveBeenCalled();
  });

  it('should display "User since" information', () => {
    const userSince = fixture.debugElement.queryAll(
      By.css('p.text-white\\/70')
    )[1];
    expect(userSince.nativeElement.textContent).toContain('User since');
  });

  it('should display "Account settings" heading', () => {
    const accountSettings = fixture.debugElement.query(By.css('p.underline'));
    expect(accountSettings.nativeElement.textContent).toContain(
      'Account settings'
    );
  });

  it('should display Spotify connected button', () => {
    const spotifyButton = fixture.debugElement.query(
      By.css('button.bg-\\[\\#1DB954\\]')
    );
    expect(spotifyButton).toBeTruthy();
    expect(spotifyButton.nativeElement.textContent).toMatch(
      /Connected|Spotify connected/
    );
  });

  it('should display logo with correct router link', () => {
    const logoLink = fixture.debugElement.query(
      By.css('a[routerLink="/dashboard"]')
    );
    const logoImg = fixture.debugElement.query(By.css('img[alt="Logo"]'));

    expect(logoLink).toBeTruthy();
    expect(logoImg).toBeTruthy();
    expect(logoImg.nativeElement.src).toContain('/images/logo.png');
  });

  it('should use settingStore background', () => {
    const container = fixture.debugElement.query(By.css('.bg-cover'));
    expect(container).toBeTruthy();
  });

  it('should have responsive layout classes', () => {
    const mainContainer = fixture.debugElement.query(By.css('.flex.flex-col'));
    expect(mainContainer.nativeElement.classList).toContain('lg:flex-row');
    expect(mainContainer.nativeElement.classList).toContain('lg:items-start');
  });

  it('should have profile card with correct styling', () => {
    const profileCard = fixture.debugElement.query(
      By.css('.bg-\\[\\#48404A\\]')
    );
    expect(profileCard).toBeTruthy();
    expect(profileCard.nativeElement.classList).toContain('rounded-xl');
  });

  it('should display Spotify logo in connected button', () => {
    const spotifyLogo = fixture.debugElement.query(
      By.css('img[alt="Spotify logo"]')
    );
    expect(spotifyLogo).toBeTruthy();
    expect(spotifyLogo.nativeElement.src).toContain('/images/spotify.png');
  });

  it('should handle empty profile data gracefully', () => {
    // Mock empty profile data
    mockProfileStore.display_name.and.returnValue('');
    mockProfileStore.email.and.returnValue('');
    fixture.detectChanges();

    const displayName = fixture.debugElement.query(By.css('h2.underline'));
    const email = fixture.debugElement.query(By.css('p.text-white\\/70'));

    expect(displayName.nativeElement.textContent).toBe('');
    expect(email.nativeElement.textContent).toBe('');
  });
});
