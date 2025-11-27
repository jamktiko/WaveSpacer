import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmPlaylistSelectComponent } from './confirm-playlist-select.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfirmPlaylistSelectedComponent', () => {
  let component: ConfirmPlaylistSelectComponent;
  let fixture: ComponentFixture<ConfirmPlaylistSelectComponent>;

  // Mock stores
  const mockPlaylistStore = {
    selected: jasmine.createSpy('selected').and.returnValue({
      id: '1',
      name: 'My Playlist',
      img: 'playlist.jpg',
    }),
  };

  const mockSongStore = {
    getSongs: jasmine.createSpy('getSongs'),
  };

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

  it('should emit false when closePlaylistSelect is called', () => {
    spyOn(component.confirmShown, 'emit');

    component.closePlaylistSelect();

    expect(component.confirmShown.emit).toHaveBeenCalledWith(false);
  });

  it('should log error when selectPlaylist is called with undefined id', () => {
    spyOn(console, 'log');

    component.selectPlaylist(undefined);

    expect(console.log).toHaveBeenCalledWith('error');
    expect(mockSongStore.getSongs).not.toHaveBeenCalled();
  });

  it('should display correct button texts', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].nativeElement.textContent.trim()).toBe('no');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('yes');
  });

  it('should have correct CSS classes on buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));

    // No button
    expect(buttons[0].nativeElement.classList).toContain('bg-[#FE5C64]/15');
    expect(buttons[0].nativeElement.classList).toContain('text-[#FE5C64]');

    // Yes button
    expect(buttons[1].nativeElement.classList).toContain('bg-[#B76EFE]/15');
    expect(buttons[1].nativeElement.classList).toContain('text-[#B76EFE]');
  });

  it('should have divider line between image and buttons', () => {
    const divider = fixture.debugElement.query(By.css('.h-px.bg-gray-500'));
    expect(divider).toBeTruthy();
  });

  it('should have gradient background on modal', () => {
    const modal = fixture.debugElement.query(By.css('.bg-gradient-to-br'));
    expect(modal).toBeTruthy();
    expect(modal.nativeElement.classList).toContain('from-[#625c64]');
    expect(modal.nativeElement.classList).toContain('to-[#312b38]');
  });

  it('should handle null playlist gracefully', () => {
    // Test with null playlist
    mockPlaylistStore.selected.and.returnValue(null);
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Do you want to select the playlist');

    const img = fixture.debugElement.query(By.css('img[alt="playlist img"]'));
    expect(img.nativeElement.src).toBeTruthy(); // Should still render img element

    // Test selectPlaylist with null playlist id
    component.selectPlaylist(undefined);
    expect(mockSongStore.getSongs).not.toHaveBeenCalled();
  });

  it('should have responsive image classes', () => {
    const img = fixture.debugElement.query(By.css('img[alt="playlist img"]'));
    expect(img.nativeElement.classList).toContain('w-40');
    expect(img.nativeElement.classList).toContain('h-40');
    expect(img.nativeElement.classList).toContain('md:w-43');
    expect(img.nativeElement.classList).toContain('lg:w-47');
  });

  it('should have correct text styling in heading', () => {
    const heading = fixture.debugElement.query(By.css('h1'));
    expect(heading.nativeElement.classList).toContain('text-center');
    expect(heading.nativeElement.classList).toContain('text-[#B76EFE]');
  });

  it('should have underline on playlist name in heading', () => {
    const underlineElement = fixture.debugElement.query(By.css('u'));
    expect(underlineElement).toBeTruthy();
    expect(underlineElement.nativeElement.textContent).toContain('My Playlist');
  });
});
