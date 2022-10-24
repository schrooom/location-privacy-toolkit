import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { PrivacyConfigurationSharingComponent } from './privacy-configuration-sharing.component'

describe('PrivacyConfigurationSharingComponent', () => {
  let component: PrivacyConfigurationSharingComponent
  let fixture: ComponentFixture<PrivacyConfigurationSharingComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyConfigurationSharingComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(PrivacyConfigurationSharingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
