import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalTrainerComponent } from './functional-trainer.component';

describe('FunctionalTrainerComponent', () => {
  let component: FunctionalTrainerComponent;
  let fixture: ComponentFixture<FunctionalTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionalTrainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunctionalTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
