import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mada5ilComponent } from './mada5il.component';

describe('Mada5ilComponent', () => {
  let component: Mada5ilComponent;
  let fixture: ComponentFixture<Mada5ilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mada5ilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mada5ilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
