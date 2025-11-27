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

  const mockSongStore = {
    songs: jasmine.createSpy('songs').and.returnValue([
      {
        id: 1,
        track_image: 'song1.png',
        name: 'Song One',
        artist_names: ['Artist One', 'Artist Two'],
      },
      {
        id: 2,
        track_image: 'song2.png',
        name: 'Song Two',
        artist_names: ['Artist Three'],
      },
    ]),
    getSongs: jasmine.createSpy('getSongs'),
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProfile and getPlaylists on init', () => {
    component.ngOnInit(); // Pakollinen spy-kutsujen aktivoimiseksi
    expect(mockProfileStore.getProfile).toHaveBeenCalled();
    expect(mockPlaylistStore.getPlaylists).toHaveBeenCalled();
  });

  it('should set the dashboard title from uiStore', () => {
    expect(component.title).toBe('WaveSpacer');
  });

  it('should set a random playlist image', () => {
    component.randomPlaylistImg = 'playlist1.png';
    expect(component.randomPlaylistImg).toBe('playlist1.png');
  });

  it('should set a random song with correct artist string', () => {
    component.randomSong = {
      img: 'song1.png',
      song: 'Song One',
      artist: 'Artist One, Artist Two',
    };

    expect(component.randomSong.img).toBe('song1.png');
    expect(component.randomSong.song).toBe('Song One');
    expect(component.randomSong.artist).toBe('Artist One, Artist Two');
  });

  it('should render profile picture in template', () => {
    const imgEl = fixture.debugElement.query(By.css('img[alt="profilepic"]'));
    expect(imgEl).toBeTruthy();
  });

  it('should call toggleDropdownVisibility on profile picture click', () => {
    const profileContainer = fixture.debugElement.query(
      By.css('#profile-container')
    );
    expect(profileContainer).toBeTruthy();

    profileContainer.triggerEventHandler('click', null);
    expect(mockUiStore.toggleDropdownVisibility).toHaveBeenCalled();
  });

  it('should create chart on init', () => {
    expect(component.chart).toBeDefined();
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
});
