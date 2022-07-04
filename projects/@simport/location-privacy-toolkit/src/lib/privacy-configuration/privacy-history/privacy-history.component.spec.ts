import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyHistoryComponent } from './privacy-history.component';

describe('PrivacyHistoryComponent', () => {
  let component: PrivacyHistoryComponent;
  let fixture: ComponentFixture<PrivacyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
