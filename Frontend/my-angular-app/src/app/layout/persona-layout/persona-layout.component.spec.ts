import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaLayoutComponent } from './persona-layout.component';

describe('PersonaLayoutComponent', () => {
  let component: PersonaLayoutComponent;
  let fixture: ComponentFixture<PersonaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonaLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
