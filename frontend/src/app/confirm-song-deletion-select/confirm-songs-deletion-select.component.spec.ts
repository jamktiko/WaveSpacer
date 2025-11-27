import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmSongDeletionSelectComponent } from './confirm-song-deletion-select.component';

describe('ConfirmSongsDeletedComponent', () => {
  let component: ConfirmSongDeletionSelectComponent;
  let fixture: ComponentFixture<ConfirmSongDeletionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmSongDeletionSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmSongDeletionSelectComponent);
    component = fixture.componentInstance;

    // Mockataan selectAmount ja playlistStore
    component.selectAmount = 3;
    component.playlistStore = {
      selected: () => ({ img: 'test.jpg', name: 'Test Playlist' }),
    } as any;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct message with selectAmount', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('3');
  });

  it('should render playlist image', () => {
    const img = fixture.debugElement.query(By.css('img[alt="playlist img"]'));
    expect(img.nativeElement.src).toContain('test.jpg');
  });

  it('should display playlist name', () => {
    const p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toContain('Test Playlist');
  });

  it('should call closeSongDeletionConfirm when "no" button is clicked', () => {
    spyOn(component, 'closeSongDeletionConfirm');
    const button = fixture.debugElement.queryAll(By.css('button'))[0];
    button.nativeElement.click();
    expect(component.closeSongDeletionConfirm).toHaveBeenCalled();
  });

  it('should call deleteSongs when "yes" button is clicked', () => {
    spyOn(component, 'deleteSongs');
    const button = fixture.debugElement.queryAll(By.css('button'))[1];
    button.nativeElement.click();
    expect(component.deleteSongs).toHaveBeenCalled();
  });

  it('should emit false when closeSongDeletionConfirm is called', () => {
    spyOn(component.songDeletionConfirmVisible, 'emit');

    component.closeSongDeletionConfirm();

    expect(component.songDeletionConfirmVisible.emit).toHaveBeenCalledWith(
      false
    );
  });

  it('should update when selectAmount input changes', () => {
    component.selectAmount = 5;
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('5');
  });

  it('should have correct button texts', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].nativeElement.textContent.trim()).toBe('no');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('yes');
  });

  it('should have correct CSS classes on buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));

    expect(buttons[0].nativeElement.classList).toContain('bg-[#FE5C64]/15');
    expect(buttons[0].nativeElement.classList).toContain('text-[#FE5C64]');

    expect(buttons[1].nativeElement.classList).toContain('bg-[#B76EFE]/15');
    expect(buttons[1].nativeElement.classList).toContain('text-[#B76EFE]');
  });
});
