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
});
