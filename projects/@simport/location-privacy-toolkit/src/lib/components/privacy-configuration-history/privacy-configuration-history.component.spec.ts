import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PrivacyConfigurationHistoryComponent } from './privacy-configuration-history.component'

describe('PrivacyConfigurationHistoryComponent', () => {
  let component: PrivacyConfigurationHistoryComponent
  let fixture: ComponentFixture<PrivacyConfigurationHistoryComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyConfigurationHistoryComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyConfigurationHistoryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
