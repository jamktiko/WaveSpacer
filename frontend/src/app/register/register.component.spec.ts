// src/app/register/register.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RegisterComponent } from './register.component';
import { provideRouter } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent], // standalone-komponentti
      providers: [
        provideRouter([]), // fake router testejä varten
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // renderöi template
  });

  // 1️⃣ Testaa komponentin luominen
  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  // 2️⃣ Testaa että heading on oikein
  it('should render main heading "Register"', () => {
    const heading = fixture.debugElement.query(
      By.css('div.bg-gradient-to-br h1')
    ).nativeElement;
    expect(heading.textContent.trim()).toBe('Register');
  });

  // 3️⃣ Testaa Register-napin olemassaolo
  it('should have a Register button', () => {
    const registerButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(registerButton).toBeTruthy();
    expect(registerButton.textContent.trim()).toBe('Register');
  });

  // 4️⃣ Voit lisätä testin input-elementeille
  it('should have 3 input fields', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs.length).toBe(3);
  });

  // EXISTING TESTS
  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('should render main heading "Register"', () => {
    const heading = fixture.debugElement.query(
      By.css('div.bg-gradient-to-br h1')
    ).nativeElement;
    expect(heading.textContent.trim()).toBe('Register');
  });

  it('should have a Register button', () => {
    const registerButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(registerButton).toBeTruthy();
    expect(registerButton.textContent.trim()).toBe('Register');
  });

  it('should have 3 input fields', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs.length).toBe(3);
  });

  // NEW ADDITIONAL TESTS:

  it('should initialize with title from uiStore', () => {
    expect(component.title).toBe('WaveSpacer');
  });

  it('should display logo with correct router link', () => {
    const logoLink = fixture.debugElement.query(By.css('a[routerLink="/"]'));
    const logoImg = fixture.debugElement.query(By.css('img[alt="Logo"]'));

    expect(logoLink).toBeTruthy();
    expect(logoImg).toBeTruthy();
    expect(logoImg.nativeElement.src).toContain('/images/logo.png');
  });

  it('should display subtitle text', () => {
    const subtitle = fixture.debugElement.query(By.css('p.font-neutral'));
    expect(subtitle.nativeElement.textContent).toContain(
      'and connect your Spotify after'
    );
  });

  it('should have email input with correct placeholder', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    const emailInput = inputs[0];

    expect(emailInput.nativeElement.type).toBe('email');
    expect(emailInput.nativeElement.placeholder).toBe('AÖ1234@student.jamk.fi');
  });

  it('should have password inputs with correct placeholders', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    const passwordInput = inputs[1];
    const repeatPasswordInput = inputs[2];

    expect(passwordInput.nativeElement.type).toBe('password');
    expect(passwordInput.nativeElement.placeholder).toBe('password');

    expect(repeatPasswordInput.nativeElement.type).toBe('password');
    expect(repeatPasswordInput.nativeElement.placeholder).toBe(
      'repeat password'
    );
  });

  it('should have input fields with correct styling', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));

    inputs.forEach((input) => {
      expect(input.nativeElement.classList).toContain('rounded-md');
      expect(input.nativeElement.classList).toContain('text-white');
      expect(input.nativeElement.classList).toContain('border');
      expect(input.nativeElement.classList).toContain('border-[#7C7C7C]');
    });
  });

  it('should have register button with correct styling', () => {
    const registerButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );

    expect(registerButton.nativeElement.classList).toContain(
      'bg-gradient-to-r'
    );
    expect(registerButton.nativeElement.classList).toContain('from-[#594765]');
    expect(registerButton.nativeElement.classList).toContain('to-[#6a5280]');
    expect(registerButton.nativeElement.classList).toContain('rounded-3xl');
  });

  it('should have footer text for existing account', () => {
    const footerText = fixture.debugElement.query(
      By.css('.text-\\[\\#7C7C7C\\]')
    );
    expect(footerText.nativeElement.textContent).toContain(
      'Already have an account?'
    );
  });

  it('should use settingStore background', () => {
    const container = fixture.debugElement.query(By.css('.bg-cover'));
    expect(container).toBeTruthy();
  });

  it('should have gradient background on form', () => {
    const form = fixture.debugElement.query(By.css('.bg-gradient-to-br'));
    expect(form).toBeTruthy();
    expect(form.nativeElement.classList).toContain('from-[#625c64]');
    expect(form.nativeElement.classList).toContain('to-[#312b38]');
  });

  it('should have border on form container', () => {
    const form = fixture.debugElement.query(By.css('.border-\\[\\#58525A\\]'));
    expect(form).toBeTruthy();
    expect(form.nativeElement.classList).toContain('border-1');
  });

  it('should have divider line above footer', () => {
    const divider = fixture.debugElement.query(By.css('.border-t'));
    expect(divider).toBeTruthy();
    expect(divider.nativeElement.classList).toContain('border-[#58525A]');
  });

  it('should have responsive width classes on form', () => {
    const form = fixture.debugElement.query(By.css('.bg-gradient-to-br'));
    expect(form.nativeElement.classList).toContain('w-[17rem]');
    expect(form.nativeElement.classList).toContain('md:w-[25rem]');
  });

  it('should have responsive padding on inputs container', () => {
    const inputsContainer = fixture.debugElement.query(By.css('.py-5.px-5'));
    expect(inputsContainer.nativeElement.classList).toContain('lg:px-5');
    expect(inputsContainer.nativeElement.classList).toContain('lg:py-8');
    expect(inputsContainer.nativeElement.classList).toContain('xl:py-10');
  });

  it('should have responsive gap between inputs', () => {
    const inputsContainer = fixture.debugElement.query(
      By.css('.flex.flex-col')
    );
    expect(inputsContainer.nativeElement.classList).toContain('gap-3');
    expect(inputsContainer.nativeElement.classList).toContain('md:gap-5');
  });

  it('should have focus styles on input fields', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));

    inputs.forEach((input) => {
      expect(input.nativeElement.classList).toContain('focus:outline-none');
      expect(input.nativeElement.classList).toContain('focus:border-white');
    });
  });
});
