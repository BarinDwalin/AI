import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSettingsComponent } from './hero-settings.component';

describe('HeroSettingsComponent', () => {
  let component: HeroSettingsComponent;
  let fixture: ComponentFixture<HeroSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
