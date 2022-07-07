import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { PrivacyConfigurationOptionComponent } from './privacy-configuration-options.component'

describe('PrivacyConfigurationOptionComponent', () => {
  let component: PrivacyConfigurationOptionComponent
  let fixture: ComponentFixture<PrivacyConfigurationOptionComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyConfigurationOptionComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(PrivacyConfigurationOptionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
