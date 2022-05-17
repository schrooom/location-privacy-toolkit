import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPrivacyToolkitComponent } from './location-privacy-toolkit.component';

describe('LocationPrivacyToolkitComponent', () => {
  let component: LocationPrivacyToolkitComponent;
  let fixture: ComponentFixture<LocationPrivacyToolkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationPrivacyToolkitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPrivacyToolkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
