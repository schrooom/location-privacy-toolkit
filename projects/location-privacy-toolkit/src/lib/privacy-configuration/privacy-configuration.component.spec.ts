import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PrivacyConfigurationComponent } from './privacy-configuration.component'

describe('PrivacyConfigurationComponent', () => {
  let component: PrivacyConfigurationComponent
  let fixture: ComponentFixture<PrivacyConfigurationComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyConfigurationComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyConfigurationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
