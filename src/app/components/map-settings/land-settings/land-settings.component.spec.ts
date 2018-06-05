import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandSettingsComponent } from './land-settings.component';

describe('LandSettingsComponent', () => {
  let component: LandSettingsComponent;
  let fixture: ComponentFixture<LandSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
