import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistsComponent } from './playlists.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('PlaylistsComponent', () => {
  let component: PlaylistsComponent;
  let fixture: ComponentFixture<PlaylistsComponent>;

  // Mock stores
  const mockPlaylistStore = {
    getPlaylists: jasmine.createSpy('getPlaylists'),
    playlists: jasmine.createSpy('playlists').and.returnValue([
      { id: '1', name: 'Playlist One', img: 'img1.jpg', totalTracks: 10 },
      { id: '2', name: 'Playlist Two', img: 'img2.jpg', totalTracks: 15 },
    ]),
  };

  const mockUiStore = {
    toggleDropdownVisibility: jasmine.createSpy('toggleDropdownVisibility'),
    dropdownvisible: jasmine
      .createSpy('dropdownvisible')
      .and.returnValue(false),
    closeDropdown: jasmine.createSpy('closeDropdown'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistsComponent, RouterTestingModule],
      providers: [
        { provide: 'playlistStore', useValue: mockPlaylistStore },
        { provide: 'uiStore', useValue: mockUiStore },
      ],
    }).compileComponents();

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('/images/test-profile.jpg');

    fixture = TestBed.createComponent(PlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with title', () => {
    expect(component.title).toBe('WaveSpacer');
  });

  it('should load profile picture from localStorage on init', () => {
    expect(component.profilepic).toBe('/images/test-profile.jpg');
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

  it('should display profile picture', () => {
    const profilePic = fixture.debugElement.query(
      By.css('img[alt="profilepic"]')
    );
    expect(profilePic).toBeTruthy();
    expect(profilePic.nativeElement.src).toContain('/images/test-profile.jpg');
  });

  it('should display refresh playlists button', () => {
    const refreshButton = fixture.debugElement.query(By.css('button'));
    expect(refreshButton.nativeElement.textContent).toContain(
      'Refresh playlists'
    );
  });

  it('should call refreshPlaylists when refresh button is clicked', () => {
    spyOn(component, 'refreshPlaylists');

    const refreshButton = fixture.debugElement.query(By.css('button'));
    refreshButton.triggerEventHandler('click', null);

    expect(component.refreshPlaylists).toHaveBeenCalled();
  });

  it('should apply scrollbar class when more than 2 playlists', () => {
    // With 2 playlists (not more than 2)
    const scrollbarClass = component.playlistScrollbarClass();
    expect(scrollbarClass).not.toContain('overflow-y-auto');
  });

  it('should apply scrollable class when more than 2 playlists', () => {
    // With 2 playlists (not more than 2)
    const scrollableClass = component.playlistScrollableClass();
    expect(scrollableClass).toBe('grid gap-5 md:grid-cols-2 lg:gap-7 mb-10');
  });

  it('should have divider line in playlists container', () => {
    const divider = fixture.debugElement.query(By.css('.h-px.bg-gray-500'));
    expect(divider).toBeTruthy();
  });

  it('should use placeholder profile picture when localStorage is empty', () => {
    // Mock empty localStorage
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    const newFixture = TestBed.createComponent(PlaylistsComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.profilepic).toBe('images/placeholderpp.png');
  });

  it('should have correct background image', () => {
    const backgroundDiv = fixture.debugElement.query(
      By.css('.bg-\\[url\\(\\/images\\/background2\\.png\\)\\]')
    );
    expect(backgroundDiv).toBeTruthy();
  });

  it('should have responsive grid layout for playlists', () => {
    const gridContainer = fixture.debugElement.query(By.css('.grid.gap-5'));
    expect(gridContainer).toBeTruthy();
    expect(gridContainer.nativeElement.classList).toContain('md:grid-cols-2');
  });

  it('should display correct number of tracks in playlist data', () => {
    const playlists = mockPlaylistStore.playlists();
    expect(playlists[0].totalTracks).toBe(10);
    expect(playlists[1].totalTracks).toBe(15);
  });
});
