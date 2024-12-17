import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasarifComponent } from './masarif.component';

describe('MasarifComponent', () => {
  let component: MasarifComponent;
  let fixture: ComponentFixture<MasarifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasarifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasarifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
