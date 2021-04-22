import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionPersonalComponent } from './accion-personal.component';

describe('AccionPersonalComponent', () => {
  let component: AccionPersonalComponent;
  let fixture: ComponentFixture<AccionPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccionPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
