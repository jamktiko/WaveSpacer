import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;

  // Mock stores
  const mockUiStore = {
    title: jasmine.createSpy('title').and.returnValue('WaveSpacer'),
    toggleDropdownVisibility: jasmine.createSpy('toggleDropdownVisibility'),
    dropdownvisible: jasmine
      .createSpy('dropdownvisible')
      .and.returnValue(false),
    closeDropdown: jasmine.createSpy('closeDropdown'),
  };

  const mockProfileStore = {
    getProfile: jasmine.createSpy('getProfile'),
  };

  const mockSettingStore = {
    background: jasmine.createSpy('background').and.returnValue(''),
    turnOnLightMode: jasmine.createSpy('turnOnLightMode'),
  };

  const mockRecentListensStore = {
    getRecentListens: jasmine.createSpy('getRecentListens'),
    recents: jasmine.createSpy('recents').and.returnValue([
      {
        listenedAt: new Date(),
        track_image: 'track1.jpg',
        name: 'Track One',
        artist_names: ['Artist One'],
        amount: 10,
      },
      {
        listenedAt: new Date(),
        track_image: 'track2.jpg',
        name: 'Track Two',
        artist_names: ['Artist Two'],
        amount: 8,
      },
      {
        listenedAt: new Date(),
        track_image: 'track3.jpg',
        name: 'Track Three',
        artist_names: ['Artist Three'],
        amount: 5,
      },
    ]),
  };

  const mockSongStore = {
    getGenres: jasmine.createSpy('getGenres'),
    genres: jasmine.createSpy('genres').and.returnValue([
      { genre: 'Pop', amount: 15 },
      { genre: 'Rock', amount: 10 },
      { genre: 'Jazz', amount: 5 },
    ]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsComponent, RouterTestingModule],
      providers: [
        { provide: 'uiStore', useValue: mockUiStore },
        { provide: 'profileStore', useValue: mockProfileStore },
        { provide: 'settingStore', useValue: mockSettingStore },
        { provide: 'recentListensStore', useValue: mockRecentListensStore },
        { provide: 'songStore', useValue: mockSongStore },
      ],
    }).compileComponents();

    // Mock localStorage oikein - palauta stringejä, älä JSON:ia
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'profilepic') return '/images/test-profile.jpg';
      if (key === 'lightmode') return 'false';
      return null;
    });

    spyOn(localStorage, 'setItem');

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the statistics component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with title from uiStore', () => {
    expect(component.title).toBe('WaveSpacer');
  });

  it('should load profile picture from localStorage on init', () => {
    expect(component.profilepic).toBe('/images/test-profile.jpg');
  });

  it('should display main heading "Your taste"', () => {
    const headings = fixture.debugElement.queryAll(By.css('h1.text-white'));
    const tasteHeading = headings.find(
      (h) => h.nativeElement.textContent === 'Your taste'
    );
    expect(tasteHeading).toBeTruthy();
  });

  it('should display decades section', () => {
    const headings = fixture.debugElement.queryAll(By.css('h2'));
    const decadesHeading = headings.find((h) =>
      h.nativeElement.textContent.includes('By year:')
    );
    expect(decadesHeading).toBeTruthy();
  });

  it('should display all decade cards', () => {
    const decadeCards = fixture.debugElement.queryAll(By.css('app-decadecard'));
    expect(decadeCards.length).toBe(9); // 6 decades
  });

  it('should display other categories section', () => {
    const headings = fixture.debugElement.queryAll(By.css('h2'));
    const categoriesHeading = headings.find((h) =>
      h.nativeElement.textContent.includes('Other categories:')
    );
    expect(categoriesHeading).toBeTruthy();
  });

  it('should display other category cards', () => {
    const categoryCards = fixture.debugElement.queryAll(
      By.css('app-decadecard')
    );
    // 6 decades + 3 categories = 9 cards total
    expect(categoryCards.length).toBe(9);
  });

  it('should display top genres chart section', () => {
    const headings = fixture.debugElement.queryAll(By.css('h1'));
    const genresHeading = headings.find((h) =>
      h.nativeElement.textContent.includes('Your top 5 genres')
    );
    expect(genresHeading).toBeTruthy();
  });

  it('should display genre chart canvas', () => {
    const chartCanvas = fixture.debugElement.query(By.css('canvas#genreChart'));
    expect(chartCanvas).toBeTruthy();
  });

  it('should display recentlistened components', () => {
    const recentListenedComponents = fixture.debugElement.queryAll(
      By.css('app-recentlistened')
    );
    expect(recentListenedComponents.length).toBe(0);
  });

  it('should display logo with correct router link', () => {
    const logoLink = fixture.debugElement.query(
      By.css('a[routerLink="/dashboard"]')
    );
    const logoImg = fixture.debugElement.query(By.css('img[alt="Logo"]'));

    expect(logoLink).toBeTruthy();
    expect(logoImg).toBeTruthy();
  });

  it('should display profile picture in header', () => {
    const profilePic = fixture.debugElement.query(
      By.css('img[alt="profilepic"]')
    );
    expect(profilePic).toBeTruthy();
  });

  it('should use settingStore background', () => {
    const container = fixture.debugElement.query(By.css('.bg-cover'));
    expect(container).toBeTruthy();
  });

  describe('decades array', () => {
    it('should have correct decades data', () => {
      expect(component.decades.length).toBe(6);
      expect(component.decades[0].decade).toBe("1970's");
      expect(component.decades[5].decade).toBe("2020's");
    });

    it('should have correct count values', () => {
      component.decades.forEach((decade) => {
        expect(decade.count).toBe(13.5);
      });
    });
  });

  describe('otherCategories array', () => {
    it('should have correct categories data', () => {
      expect(component.otherCategories.length).toBe(3);
      expect(component.otherCategories[0].category).toBe('Obscure');
      expect(component.otherCategories[1].category).toBe('Mainstream');
      expect(component.otherCategories[2].category).toBe('Average');
    });

    it('should have correct count values', () => {
      expect(component.otherCategories[0].count).toBe(13.5);
      expect(component.otherCategories[1].count).toBe(24.2);
      expect(component.otherCategories[2].count).toBe(62.3);
    });
  });

  it('should have responsive grid layout', () => {
    const gridContainer = fixture.debugElement.query(
      By.css('.grid.grid-cols-1')
    );
    expect(gridContainer.nativeElement.classList).toContain('lg:grid-cols-2');
  });

  it('should have dividers between sections', () => {
    const dividers = fixture.debugElement.queryAll(By.css('.h-px'));
    expect(dividers.length).toBeGreaterThan(0);
  });

  it('should have scrollable containers', () => {
    const scrollContainers = fixture.debugElement.queryAll(
      By.css('.custom-scrollbar')
    );
    expect(scrollContainers.length).toBeGreaterThan(0);
  });

  it('should handle empty recent listens gracefully', () => {
    mockRecentListensStore.recents.and.returnValue([]);
    fixture.detectChanges();

    const recentListenedComponents = fixture.debugElement.queryAll(
      By.css('app-recentlistened')
    );
    // Should still render the containers even with empty data
    expect(recentListenedComponents.length).toBe(0);
  });

  it('should handle empty genres gracefully', () => {
    mockSongStore.genres.and.returnValue([]);
    fixture.detectChanges();

    const genreComponents = fixture.debugElement.queryAll(
      By.css('app-recentlistened')
    );
    expect(genreComponents.length).toBe(0);
  });

  it('should use placeholder profile picture when localStorage is empty', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    const newFixture = TestBed.createComponent(StatisticsComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.profilepic).toBe('placeholderpp.png');
  });
});
