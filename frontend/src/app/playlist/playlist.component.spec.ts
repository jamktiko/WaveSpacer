import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistComponent } from './playlist.component';
import { By } from '@angular/platform-browser';

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  const mockPlaylistStore = {
    playlists: jasmine
      .createSpy('playlists')
      .and.returnValue([
        { id: '123', name: 'Test Playlist', img: 'test.jpg', totalTrack: 10 },
      ]),
    selectPlaylist: jasmine.createSpy('selectPlaylist'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistComponent],
      providers: [{ provide: 'playlistStore', useValue: mockPlaylistStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;

    // Aseta inputit
    component.name = 'My Playlist';
    component.img = 'playlist.jpg';
    component.totalTrack = 15;
    component.id = '123';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display playlist name and track count', () => {
    const h3 = fixture.nativeElement.querySelector('h3');
    expect(h3.textContent).toContain('My Playlist');
    expect(h3.textContent).toContain('15 tracks');
  });

  it('should display playlist image', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.src).toContain('playlist.jpg');
  });
});
