import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentlistenedComponent } from './recentlistened.component';
import { By } from '@angular/platform-browser';

describe('RecentlistenedComponent', () => {
  let component: RecentlistenedComponent;
  let fixture: ComponentFixture<RecentlistenedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentlistenedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentlistenedComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('dashboardRecents list type', () => {
    beforeEach(() => {
      component.img = 'track.jpg';
      component.trackName = 'Test Track';
      component.artists = ['Artist One', 'Artist Two'];
      component.index = 0;
      component.firstRecentSong = true;
      component.plays = 5;
      component.listenedAt = new Date('2024-01-01');
      component.listType = 'dashboardRecents';
      component.title = 'Recently Played';
      fixture.detectChanges();
    });

    it('should display dashboardRecents layout correctly', () => {
      const container = fixture.debugElement.query(
        By.css('.bg-\\[\\#323132\\]')
      );
      expect(container).toBeTruthy();
    });

    it('should display title when firstRecentSong is true', () => {
      const title = fixture.debugElement.query(By.css('h1'));
      expect(title.nativeElement.textContent).toBe('Recently Played');
    });

    it('should not display title when firstRecentSong is false', () => {
      component.firstRecentSong = false;
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('h1'));
      expect(title).toBeFalsy();
    });

    it('should display formatted index with leading zero', () => {
      const index = fixture.debugElement.query(
        By.css('p.text-white.text-right')
      );
      expect(index.nativeElement.textContent).toBe('01.');
    });

    it('should display track image', () => {
      const img = fixture.debugElement.query(By.css('img[alt="track img"]'));
      expect(img.nativeElement.src).toContain('track.jpg');
      expect(img.nativeElement.classList).toContain('rounded-xl');
    });

    it('should display plays count', () => {
      const plays = fixture.debugElement.queryAll(
        By.css('.text-\\[\\#969696\\]')
      );
      expect(
        plays.some((p) => p.nativeElement.textContent.includes('5 plays'))
      ).toBeTrue();
    });

    it('should display formatted date', () => {
      const date = fixture.debugElement.queryAll(
        By.css('.text-\\[\\#969696\\]')
      );
      expect(
        date.some((d) =>
          d.nativeElement.textContent.includes('Mon, 01 Jan 2024')
        )
      ).toBeTrue();
    });
  });

  describe('statisticsList list type', () => {
    beforeEach(() => {
      component.img = 'track2.jpg';
      component.artists = ['Statistics Artist'];
      component.index = 1;
      component.firstRecentSong = true;
      component.plays = 10;
      component.listType = 'statisticsList';
      component.title = 'Top Tracks';
      fixture.detectChanges();
    });

    it('should display statisticsList layout correctly', () => {
      const title = fixture.debugElement.query(By.css('h1'));
      expect(title.nativeElement.textContent).toBe('Top Tracks');
    });

    it('should display smaller track image', () => {
      const img = fixture.debugElement.query(By.css('img[alt="track img"]'));
      expect(img.nativeElement.classList).toContain('w-10');
      expect(img.nativeElement.classList).toContain('h-10');
    });
  });

  describe('lastYearStatistic list type', () => {
    beforeEach(() => {
      component.img = 'track3.jpg';
      component.trackName = 'Last Year Track';
      component.artists = ['Year Artist'];
      component.index = 2;
      component.listType = 'lastYearStatistic';
      fixture.detectChanges();
    });

    it('should display lastYearStatistic layout correctly', () => {
      const index = fixture.debugElement.query(
        By.css('p.text-white.text-right')
      );
      expect(index.nativeElement.textContent).toBe('03.');
    });

    it('should display very small track image', () => {
      const img = fixture.debugElement.query(By.css('img[alt="track img"]'));
      expect(img.nativeElement.classList).toContain('w-3');
      expect(img.nativeElement.classList).toContain('h-3');
    });
  });

  describe('genreList list type', () => {
    beforeEach(() => {
      component.genre = 'Rock';
      component.artists = ['Rock Artist'];
      component.index = 3;
      component.firstRecentSong = true;
      component.plays = 20;
      component.genrePercentile = '15.5';
      component.listType = 'genreList';
      component.title = 'Top Genres';
      fixture.detectChanges();
    });

    it('should display genreList layout correctly', () => {
      const container = fixture.debugElement.query(
        By.css('.bg-\\[\\#323132\\]')
      );
      expect(container).toBeTruthy();
    });

    it('should display genre title when firstRecentSong is true', () => {
      const title = fixture.debugElement.query(By.css('h1'));
      expect(title.nativeElement.textContent).toBe('Top Genres');
    });

    it('should display artists and plays count', () => {
      const artists = fixture.debugElement.queryAll(
        By.css('.text-\\[\\#969696\\]')
      );
      expect(
        artists.some((a) => a.nativeElement.textContent.includes('Rock Artist'))
      ).toBeTrue();

      expect(
        artists.some((a) => a.nativeElement.textContent.includes('20 plays'))
      ).toBeTrue();
    });
  });

  describe('formatDate method', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2024-01-01T12:00:00Z');
      const formatted = component.formatDate(testDate);

      expect(formatted).toContain('Mon, 01 Jan 2024');
    });

    it('should return undefined for null date', () => {
      const formatted = component.formatDate(null!);
      expect(formatted).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('should set formattedDate when listenedAt is provided', () => {
      component.listenedAt = new Date('2024-01-01');
      component.ngOnInit();

      expect(component.formattedDate).toContain('Mon, 01 Jan 2024');
    });

    it('should not set formattedDate when listenedAt is null', () => {
      component.listenedAt = null;
      component.ngOnInit();

      expect(component.formattedDate).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty artists array', () => {
      component.listType = 'dashboardRecents';
      component.artists = [];
      fixture.detectChanges();

      const artists = fixture.debugElement.query(
        By.css('.text-\\[\\#969696\\]')
      );
      expect(artists.nativeElement.textContent).toBe('');
    });

    it('should handle high index numbers', () => {
      component.listType = 'dashboardRecents';
      component.index = 99;
      fixture.detectChanges();

      const index = fixture.debugElement.query(
        By.css('p.text-white.text-right')
      );
      expect(index.nativeElement.textContent).toBe('100.');
    });
  });
});
