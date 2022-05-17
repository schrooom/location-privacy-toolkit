import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { PrivacyConfigurationDetailComponent } from './privacy-configuration-detail.component'

describe('PrivacyConfigurationDetailComponent', () => {
  let component: PrivacyConfigurationDetailComponent
  let fixture: ComponentFixture<PrivacyConfigurationDetailComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyConfigurationDetailComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(PrivacyConfigurationDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
