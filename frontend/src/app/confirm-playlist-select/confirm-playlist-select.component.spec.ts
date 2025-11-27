import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmPlaylistSelectComponent } from './confirm-playlist-select.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfirmPlaylistSelectedComponent', () => {
  let component: ConfirmPlaylistSelectComponent;
  let fixture: ComponentFixture<ConfirmPlaylistSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPlaylistSelectComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmPlaylistSelectComponent);
    component = fixture.componentInstance;

    // Mockataan playlistStore
    component.playlistStore = {
      selected: () => ({ id: '1', name: 'My Playlist', img: 'playlist.jpg' }),
    } as any;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render playlist name in heading', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('My Playlist');
  });

  it('should render playlist image', () => {
    const img = fixture.debugElement.query(By.css('img[alt="playlist img"]'));
    expect(img.nativeElement.src).toContain('playlist.jpg');
  });

  it('should call closePlaylistSelect when "no" button is clicked', () => {
    spyOn(component, 'closePlaylistSelect');
    const button = fixture.debugElement.queryAll(By.css('button'))[0];
    button.nativeElement.click();
    expect(component.closePlaylistSelect).toHaveBeenCalled();
  });

  it('should call selectPlaylist when "yes" button is clicked', () => {
    spyOn(component, 'selectPlaylist');
    const button = fixture.debugElement.queryAll(By.css('button'))[1];
    button.nativeElement.click();
    expect(component.selectPlaylist).toHaveBeenCalledWith('1');
  });

  it('should have a routerLink to "/playlistclean" on "yes" button', () => {
    const link = fixture.debugElement.query(
      By.css('a[routerLink="/playlistclean"]')
    );
    expect(link).toBeTruthy();
  });
});
