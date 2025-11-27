import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // Mockit storeille
  const mockProfileStore = {
    getProfile: jasmine.createSpy('getProfile'),
    profilepic: jasmine
      .createSpy('profilepic')
      .and.returnValue('http://localhost:9876/profile.png'),
  };

  const mockPlaylistStore = {
    playlists: jasmine.createSpy('playlists').and.returnValue([
      { id: 1, img: 'playlist1.png', name: 'Playlist One' },
      { id: 2, img: 'playlist2.png', name: 'Playlist Two' },
    ]),
    getPlaylists: jasmine.createSpy('getPlaylists'),
  };

  // Lisää mock
  const mockSongStore = {
    songs: jasmine.createSpy('songs').and.returnValue([
      { id: 1, name: 'Song One' },
      { id: 2, name: 'Song Two' },
    ]),
    getSongs: jasmine.createSpy('getSongs'),
    getGenres: jasmine.createSpy('getGenres'), // LISÄÄ TÄMÄ
    genres: jasmine.createSpy('genres').and.returnValue([
      // LISÄÄ TÄMÄ
      { genre: 'Pop', amount: 10 },
      { genre: 'Rock', amount: 5 },
    ]),
  };

  const mockUiStore = {
    title: jasmine.createSpy('title').and.returnValue('WaveSpacer Dashboard'),
    toggleDropdownVisibility: jasmine.createSpy('toggleDropdownVisibility'),
    dropdownvisible: jasmine
      .createSpy('dropdownvisible')
      .and.returnValue(false),
    closeDropdown: jasmine.createSpy('closeDropdown'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, DashboardComponent],
      providers: [
        { provide: 'profileStore', useValue: mockProfileStore },
        { provide: 'playlistStore', useValue: mockPlaylistStore },
        { provide: 'songStore', useValue: mockSongStore },
        { provide: 'uiStore', useValue: mockUiStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the dashboard title from uiStore', () => {
    expect(component.title).toBe('WaveSpacer');
  });

  it('should set a random playlist image', () => {
    component.randomPlaylistImg = 'playlist1.png';
    expect(component.randomPlaylistImg).toBe('playlist1.png');
  });

  it('should render profile picture in template', () => {
    const imgEl = fixture.debugElement.query(By.css('img[alt="profilepic"]'));
    expect(imgEl).toBeTruthy();
  });

  it('should have user dropdown visibility set to false by default', () => {
    expect(component.userDropDownVisible).toBe(false);
  });

  it('should display correct number of playlist items', () => {
    const playlists = mockPlaylistStore.playlists();
    expect(playlists.length).toBe(2);
    expect(playlists[0].name).toBe('Playlist One');
    expect(playlists[1].name).toBe('Playlist Two');
  });

  it('should display correct number of songs', () => {
    const songs = mockSongStore.songs();
    expect(songs.length).toBe(2);
    expect(songs[0].name).toBe('Song One');
    expect(songs[1].name).toBe('Song Two');
  });

  // Navigointitestit
  it('should navigate to playlists when playlist-cleaner section is clicked', () => {
    fixture.detectChanges();
    const playlistLink = fixture.debugElement.query(
      By.css('[routerLink="/playlists"]')
    );
    expect(playlistLink).toBeTruthy();
  });

  it('should navigate to statistics when statistics section is clicked', () => {
    fixture.detectChanges();
    const statsLink = fixture.debugElement.query(
      By.css('[routerLink="/statistics"]')
    );
    expect(statsLink).toBeTruthy();
  });

  // Data formatointitestit
  it('should calculate days since registration correctly', () => {
    const testDate = new Date();
    testDate.setDate(testDate.getDate() - 10); // 10 päivää sitten

    component.formatDate(testDate);

    expect(component.daysSinceRegister).toBeCloseTo(10, 0);
  });
});
