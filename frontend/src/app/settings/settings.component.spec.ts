import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  // Mock stores
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
    toggleDropdownVisibility: jasmine.createSpy('toggleDropdownVisibility'),
    dropdownvisible: jasmine
      .createSpy('dropdownvisible')
      .and.returnValue(false),
    closeDropdown: jasmine.createSpy('closeDropdown'),
    language: jasmine.createSpy('language').and.returnValue('English'),
    changeLanguage: jasmine.createSpy('changeLanguage'),
    lightmode: jasmine.createSpy('lightmode').and.returnValue(false),
    toggleLightMode: jasmine.createSpy('toggleLightMode'),
    turnOnLightMode: jasmine.createSpy('turnOnLightMode'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent, RouterTestingModule],
      providers: [
        { provide: 'uiStore', useValue: mockUiStore },
        { provide: 'settingStore', useValue: mockSettingStore },
      ],
    }).compileComponents();

    // Mock localStorage oikein
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'profilepic') return '/images/test-profile.jpg';
      if (key === 'language') return 'English';
      if (key === 'lightmode') return 'false';
      return null;
    });

    spyOn(localStorage, 'setItem');

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the settings component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with languages array', () => {
    expect(component.languages).toEqual([
      { language: 'English', id: 1 },
      { language: 'Finnish', id: 2 },
    ]);
  });

  it('should load profile picture from localStorage on init', () => {
    expect(component.profilepic).toBe('/images/test-profile.jpg');
  });

  it('should set default language to English if not in localStorage', () => {
    // Nollaa localStorage mock
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    // Luo uusi komponentti instanssi
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'English');
  });

  it('should display main heading', () => {
    // Etsi h1 joka on tekstin "Adjust all the settings" sisältävässä divissä
    const heading = fixture.debugElement.query(
      By.css('div.text-center.lg\\:text-left h1.text-white')
    );

    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toContain(
      'Adjust all the settings'
    );
  });

  it('should display settings container with correct styling', () => {
    const settingsContainer = fixture.debugElement.query(
      By.css('.bg-\\[\\#323132\\]')
    );
    expect(settingsContainer).toBeTruthy();
    expect(settingsContainer.nativeElement.classList).toContain('rounded-xl');
  });

  it('should display settings title', () => {
    const title = fixture.debugElement.query(By.css('h2.text-white'));
    expect(title.nativeElement.textContent).toBe('Settings');
  });

  it('should display all setting sections with dividers', () => {
    const dividers = fixture.debugElement.queryAll(
      By.css('.h-px.bg-\\[\\#463F48\\]')
    );
    expect(dividers.length).toBeGreaterThan(5);
  });

  it('should display account section with router link', () => {
    const accountText = fixture.debugElement.query(
      By.css('p.justify-self-start')
    );
    const accountIcon = fixture.debugElement.query(
      By.css('svg[routerLink="/profile"]')
    );

    expect(accountText.nativeElement.textContent).toContain('Account');
    expect(accountIcon).toBeTruthy();
  });

  it('should display language section with dropdown functionality', () => {
    const languageText = fixture.debugElement.queryAll(
      By.css('p.justify-self-start')
    )[1];
    const languageContainer = fixture.debugElement.query(
      By.css('.cursor-pointer')
    );

    expect(languageText.nativeElement.textContent).toContain('Language');
    expect(languageContainer).toBeTruthy();
  });

  it('should display current language', () => {
    const languageText = fixture.debugElement.query(
      By.css('.bg-\\[\\#3D383E\\] p')
    );
    expect(languageText.nativeElement.textContent).toBe('English');
  });

  it('should display light mode toggle switch', () => {
    const lightModeText = fixture.debugElement.queryAll(
      By.css('p.justify-self-start')
    )[2];
    const toggleSwitch = fixture.debugElement.query(
      By.css('input[type="checkbox"]')
    );

    expect(lightModeText.nativeElement.textContent).toContain('Light mode');
    expect(toggleSwitch).toBeTruthy();
  });

  it('should display subscription management section', () => {
    const subscriptionText = fixture.debugElement.queryAll(
      By.css('p.justify-self-start')
    )[3];
    expect(subscriptionText.nativeElement.textContent).toContain(
      'Manage subcription'
    );
  });

  it('should display about us section', () => {
    const aboutText = fixture.debugElement.queryAll(
      By.css('p.justify-self-start')
    )[4];
    expect(aboutText.nativeElement.textContent).toContain('About us');
  });

  it('should display terms of service section', () => {
    const termsText = fixture.debugElement.queryAll(
      By.css('p.justify-self-start')
    )[5];
    expect(termsText.nativeElement.textContent).toContain('Terms of Service');
  });

  it('should display disconnect Spotify button', () => {
    const spotifyButton = fixture.debugElement.query(
      By.css('button.bg-\\[\\#1DB954\\]')
    );
    expect(spotifyButton).toBeTruthy();
    expect(spotifyButton.nativeElement.textContent).toMatch(/Disconnect/);
  });

  it('should display log out button', () => {
    const logoutButtons = fixture.debugElement.queryAll(
      By.css('button.bg-\\[\\#FE5C64\\]\\/15')
    );
    expect(logoutButtons[0].nativeElement.textContent).toContain('Log out');
  });

  it('should display delete account button', () => {
    const deleteButtons = fixture.debugElement.queryAll(
      By.css('button.bg-\\[\\#FE5C64\\]\\/15')
    );
    expect(deleteButtons[1].nativeElement.textContent).toContain(
      'Delete Account'
    );
  });

  it('should display logo with correct router link', () => {
    const logoLink = fixture.debugElement.query(
      By.css('a[routerLink="/dashboard"]')
    );
    const logoImg = fixture.debugElement.query(By.css('img[alt="Logo"]'));

    expect(logoLink).toBeTruthy();
    expect(logoImg).toBeTruthy();
  });

  it('should display profile picture in header', () => {
    const profilePic = fixture.debugElement.query(
      By.css('img[alt="profilepic"]')
    );
    expect(profilePic).toBeTruthy();
  });

  describe('languageDropdownVisible method', () => {
    it('should return rounded-lg when dropdown is not visible', () => {
      mockSettingStore.dropdownvisible.and.returnValue(false);
      const result = component.languageDropdownVisible();
      expect(result).toBe('rounded-lg');
    });
  });

  describe('lightModeActive method', () => {
    it('should return bg-black when lightmode is inactive', () => {
      mockSettingStore.lightmode.and.returnValue(false);
      const result = component.lightModeActive();
      expect(result).toBe('bg-black');
    });
  });

  describe('lightModeActive2 method', () => {
    it('should return left-1 bg-[#D9D9D9] when lightmode is inactive', () => {
      mockSettingStore.lightmode.and.returnValue(false);
      const result = component.lightModeActive2();
      expect(result).toBe('left-1 bg-[#D9D9D9]');
    });
  });

  describe('modeBackground method', () => {
    it('should return dark background when lightmode is inactive', () => {
      mockSettingStore.lightmode.and.returnValue(false);
      const result = component.modeBackground();
      expect(result).toBe('bg-[url(/images/background2.png)]');
    });
  });

  it('should use settingStore background', () => {
    const container = fixture.debugElement.query(By.css('.bg-cover'));
    expect(container).toBeTruthy();
  });
});
