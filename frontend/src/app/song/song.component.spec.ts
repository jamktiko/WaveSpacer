import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongComponent } from './song.component';
import { By } from '@angular/platform-browser';

describe('SongComponent', () => {
  let component: SongComponent;
  let fixture: ComponentFixture<SongComponent>;

  // Mock store
  const mockSongSelectStore = {
    toggle: jasmine.createSpy('toggle'),
    selectedIds: jasmine.createSpy('selectedIds').and.returnValue([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongComponent],
      providers: [
        { provide: 'songSelectStore', useValue: mockSongSelectStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;

    // Aseta inputit
    component.featured = false;
    component.index = 0;
    component.song = {
      id: '123',
      name: 'Test Song',
      artist_names: ['Artist One', 'Artist Two'],
      track_image: 'song.jpg',
      amount: 5,
    } as any; // Käytä 'as any' ohittaaksesi tiukan tyypityksen

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display song name', () => {
    const songName = fixture.debugElement.query(By.css('h1.text-white'));
    expect(songName.nativeElement.textContent).toBe('Test Song');
  });

  it('should display artist names', () => {
    const artists = fixture.debugElement.query(By.css('.text-gray-400'));
    expect(artists.nativeElement.textContent).toBe(' Artist One, Artist Two');
  });

  it('should display play count', () => {
    const playCount = fixture.debugElement.queryAll(
      By.css('.text-gray-400')
    )[1];
    expect(playCount.nativeElement.textContent).toBe('(5) plays');
  });

  it('should display song image', () => {
    const songImg = fixture.debugElement.query(By.css('img[alt="track img"]'));
    expect(songImg.nativeElement.src).toContain('song.jpg');
  });

  it('should display formatted index with leading zero', () => {
    const index = fixture.debugElement.query(By.css('p.text-white.text-right'));
    expect(index.nativeElement.textContent).toBe('01.');
  });

  it('should not show checkmark when song is not selected', () => {
    // Mock that song is not selected
    mockSongSelectStore.selectedIds.and.returnValue([]);
    fixture.detectChanges();

    const checkmark = fixture.debugElement.query(By.css('svg'));
    expect(checkmark).toBeFalsy();
  });

  describe('featured songs', () => {
    beforeEach(() => {
      component.featured = true;
      fixture.detectChanges();
    });

    it('should apply grid layout for featured songs', () => {
      const featuredClass = component.featuredSongs();
      expect(featuredClass).toContain('grid grid-flow-row grid-rows-4');
    });

    it('should apply larger image for featured songs', () => {
      const featuredImgClass = component.featuredSongImg();
      expect(featuredImgClass).toContain('w-25 h-25');
    });
  });

  describe('non-featured songs', () => {
    beforeEach(() => {
      component.featured = false;
      fixture.detectChanges();
    });

    it('should apply flex layout for non-featured songs', () => {
      const nonFeaturedClass = component.featuredSongs();
      expect(nonFeaturedClass).toContain('flex items-center gap-2');
    });

    it('should apply smaller image for non-featured songs', () => {
      const nonFeaturedImgClass = component.featuredSongImg();
      expect(nonFeaturedImgClass).toContain('w-20 h-20');
    });
  });

  describe('featuredSongs method', () => {
    it('should return grid classes when featured is true', () => {
      component.featured = true;
      const result = component.featuredSongs();
      expect(result).toBe('grid grid-flow-row grid-rows-4 h-full');
    });

    it('should return flex classes when featured is false', () => {
      component.featured = false;
      const result = component.featuredSongs();
      expect(result).toBe('flex items-center gap-2');
    });
  });

  describe('featuredSongImg method', () => {
    it('should return larger image classes when featured is true', () => {
      component.featured = true;
      const result = component.featuredSongImg();
      expect(result).toBe('w-25 h-25 rounded-xl');
    });

    it('should return smaller image classes when featured is false', () => {
      component.featured = false;
      const result = component.featuredSongImg();
      expect(result).toBe('w-20 h-20 rounded-xl');
    });
  });

  it('should handle high index numbers correctly', () => {
    component.index = 99;
    fixture.detectChanges();

    const index = fixture.debugElement.query(By.css('p.text-white.text-right'));
    expect(index.nativeElement.textContent).toBe('100.');
  });

  // KORJATUT TESTIT artist_names -ongelmalle:
  it('should handle single artist', () => {
    // Luo uusi song-olio single artistilla
    component.song = {
      id: '123',
      name: 'Test Song',
      artist_names: ['Single Artist'] as any, // Käytä 'as any'
      track_image: 'song.jpg',
      amount: 5,
    };
    fixture.detectChanges();

    const artists = fixture.debugElement.query(By.css('.text-gray-400'));
    expect(artists.nativeElement.textContent).toBe(' Single Artist');
  });

  it('should handle empty artist array', () => {
    // Luo uusi song-olio tyhjällä artist listalla
    component.song = {
      id: '123',
      name: 'Test Song',
      artist_names: [] as any, // Käytä 'as any'
      track_image: 'song.jpg',
      amount: 5,
    };
    fixture.detectChanges();

    const artists = fixture.debugElement.query(By.css('.text-gray-400'));
    expect(artists.nativeElement.textContent).toBe(' ');
  });

  it('should have checkbox with correct styling', () => {
    const checkboxContainer = fixture.debugElement.query(
      By.css('span.w-5.h-5')
    );
    expect(checkboxContainer.nativeElement.classList).toContain('bg-[#B76EFE]');
    expect(checkboxContainer.nativeElement.classList).toContain('rounded-sm');
  });

  it('should have scrollable play count text', () => {
    const playCount = fixture.debugElement.queryAll(
      By.css('.text-gray-400')
    )[1];
    expect(playCount.nativeElement.classList).toContain('overflow-x-auto');
    expect(playCount.nativeElement.classList).toContain('custom-scrollbar');
  });

  it('should have responsive text classes', () => {
    const songName = fixture.debugElement.query(By.css('h1.text-white'));
    const artists = fixture.debugElement.query(By.css('.text-gray-400'));

    expect(songName.nativeElement.classList).toContain(
      'text-[clamp(1rem,1vw,1rem)]'
    );
    expect(artists.nativeElement.classList).toContain(
      'text-[clamp(0.7rem,1.3vw,0.9rem)]'
    );
  });

  it('should have hidden checkbox input', () => {
    const checkbox = fixture.debugElement.query(
      By.css('input[type="checkbox"]')
    );
    expect(checkbox.nativeElement.classList).toContain('hidden');
  });
});
