import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistcleanComponent } from './playlistclean.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('PlaylistcleanComponent', () => {
  let component: PlaylistcleanComponent;
  let fixture: ComponentFixture<PlaylistcleanComponent>;

  const mockSongStore = {
    getSongs: jasmine.createSpy('getSongs'),
    songs: jasmine.createSpy('songs').and.returnValue([]),
  };

  const mockSongSelectStore = {
    selectedIds: jasmine.createSpy('selectedIds').and.returnValue([]),
    clear: jasmine.createSpy('clear'),
    selectAll: jasmine.createSpy('selectAll'),
  };

  const mockUiStore = {
    title: jasmine.createSpy('title').and.returnValue('WaveSpacer'),
    toggleDropdownVisibility: jasmine.createSpy('toggleDropdownVisibility'),
    dropdownvisible: jasmine
      .createSpy('dropdownvisible')
      .and.returnValue(false),
    closeDropdown: jasmine.createSpy('closeDropdown'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistcleanComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    // 🔹 Mockataan localStorage ennen komponentin luontia
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'selectedPlaylist')
        return JSON.stringify({ id: 1, name: 'Test Playlist' });
      if (key === 'profilepic') return '/images/testprofile.png';
      return null;
    });

    fixture = TestBed.createComponent(PlaylistcleanComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // 🔹 triggeröi ngOnInit ilman kaatumista
  });

  it('should create the playlistclean component', () => {
    expect(component).toBeTruthy();
  });

  it('should render main heading "Choose the songs to be deleted"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = compiled.querySelectorAll('h1');
    const mainHeading = headings[1];
    expect(mainHeading?.textContent?.trim()).toContain(
      'Choose the songs to be deleted'
    );
  });

  it('should display logo image with correct src', () => {
    const logo = fixture.debugElement.query(By.css('img[alt="Logo"]'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.src).toContain('/images/logo.png');
  });

  it('should display profile picture', () => {
    const profilePic = fixture.debugElement.query(
      By.css('img[alt="profilepic"]')
    );
    expect(profilePic).toBeTruthy();
    expect(profilePic.nativeElement.src).toContain('/images/testprofile.png');
  });

  it('should display selected playlist image', () => {
    const playlistImg = fixture.debugElement.query(
      By.css('img[alt="playlist img"]')
    );
    expect(playlistImg).toBeTruthy();
  });

  it('should have a routerLink to "/dashboard" on the logo link', () => {
    const routerLink = fixture.debugElement.query(
      By.css('a[routerLink="/dashboard"]')
    );
    expect(routerLink).toBeTruthy();
  });

  it('should initialize with title from uiStore', () => {
    expect(component.title).toBe('WaveSpacer');
  });

  it('should load selected playlist from localStorage on init', () => {
    expect(component.selectedPlaylist).toEqual({
      id: 1,
      name: 'Test Playlist',
    });
  });

  it('should set confirmDeleteVisible to true when delete button is clicked', () => {
    const deleteButton = fixture.debugElement.query(
      By.css('button.bg-\\[\\#FE5C64\\]\\/15')
    );

    deleteButton.triggerEventHandler('click', null);

    expect(component.confirmDeleteVisible).toBeTrue();
  });

  it('should close confirm dialog when closeSongDeletionConfirm is called', () => {
    component.confirmDeleteVisible = true;

    component.closeSongDeletionConfirm(false);

    expect(component.confirmDeleteVisible).toBeFalse();
  });

  it('should use settingStore background', () => {
    const container = fixture.debugElement.query(By.css('.bg-cover'));
    expect(container).toBeTruthy();
  });
});
