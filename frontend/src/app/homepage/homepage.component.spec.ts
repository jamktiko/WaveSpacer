import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  // Mock stores
  const mockUiStore = {
    title: jasmine.createSpy('title').and.returnValue('WaveSpacer'),
  };

  const mockSettingStore = {
    lightmode: jasmine.createSpy('lightmode').and.returnValue(false),
    turnOnLightMode: jasmine.createSpy('turnOnLightMode'),
  };

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

  //  Komponentin luonti
  it('should create the homepage component', () => {
    expect(component).toBeTruthy();
  });

  //  Otsikon renderöinti
  it('should render title "WaveSpacer" inside h1 tag', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('WaveSpacer');
  });

  //  Register-nappi näkyy
  it('should have a Register button', () => {
    const button = fixture.nativeElement.querySelector('a button');
    expect(button?.textContent).toContain('Register');
  });

  it('should have correct router links', () => {
    const homeLink = fixture.debugElement.query(By.css('a[routerLink="/"]'));
    const registerLink = fixture.debugElement.query(
      By.css('a[routerLink="/register"]')
    );

    expect(homeLink).toBeTruthy();
    expect(registerLink).toBeTruthy();
  });

  it('should initialize title from uiStore', () => {
    expect(component.title).toBe('WaveSpacer');
  });

  it('should not call turnOnLightMode in ngOnInit if localStorage lightmode is false', () => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('false');

    component.ngOnInit();

    expect(mockSettingStore.turnOnLightMode).not.toHaveBeenCalled();
  });

  it('should have main heading text', () => {
    const mainHeading = fixture.debugElement.query(
      By.css('p.text-white.text-lg')
    );
    expect(mainHeading.nativeElement.textContent).toContain('Wave');
    expect(mainHeading.nativeElement.textContent).toContain('away');
    expect(mainHeading.nativeElement.textContent).toContain('space');
  });

  it('should have description text', () => {
    const description = fixture.debugElement.query(
      By.css('p.text-\\[\\#B76EFE\\]')
    );
    expect(description.nativeElement.textContent).toContain(
      'A fast tool for removing songs'
    );
  });

  it('should have divider in footer', () => {
    const divider = fixture.debugElement.query(By.css('.bg-gray-500'));
    expect(divider).toBeTruthy();
  });

  it('should have responsive grid layout', () => {
    const header = fixture.debugElement.query(By.css('header.grid'));
    const mainGrid = fixture.debugElement.query(By.css('.grid-flow-row'));

    expect(header).toBeTruthy();
    expect(mainGrid).toBeTruthy();
  });
});
