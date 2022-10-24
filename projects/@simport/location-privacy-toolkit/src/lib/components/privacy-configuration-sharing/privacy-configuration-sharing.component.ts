import { Component } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { BehaviorSubject } from 'rxjs'
import { LocationManagementService } from '../../services/location-management/location-management.service'

@Component({
  selector: 'privacy-configuration.sharing',
  templateUrl: './privacy-configuration-sharing.component.html',
  styleUrls: ['./privacy-configuration-sharing.component.scss'],
})
export class PrivacyConfigurationSharingComponent {
  coreFunctionalGroupChecked: BehaviorSubject<Boolean | undefined> =
    new BehaviorSubject<Boolean | undefined>(false)
  coreFunctionalAChecked: BehaviorSubject<Boolean> =
    new BehaviorSubject<Boolean>(false)
  coreFunctionalBChecked: BehaviorSubject<Boolean> =
    new BehaviorSubject<Boolean>(false)

  functionalGroupChecked: BehaviorSubject<Boolean | undefined> =
    new BehaviorSubject<Boolean | undefined>(false)
  functionalAChecked: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  )
  functionalBChecked: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  )

  analyticsGroupChecked: BehaviorSubject<Boolean | undefined> =
    new BehaviorSubject<Boolean | undefined>(false)
  analyticsAChecked: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  )
  analyticsBChecked: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  )

  adsGroupChecked: BehaviorSubject<Boolean | undefined> = new BehaviorSubject<
    Boolean | undefined
  >(false)
  adsAChecked: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false)
  adsBChecked: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false)

  otherGroupChecked: BehaviorSubject<Boolean | undefined> = new BehaviorSubject<
    Boolean | undefined
  >(false)
  otherAChecked: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false)
  otherBChecked: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false)

  constructor(
    private locationManagementService: LocationManagementService,
    private modalController: ModalController
  ) {
    this.coreFunctionalGroupChecked.subscribe((isChecked) => {
      if (isChecked != undefined) {
        this.coreFunctionalAChecked.next(isChecked)
        this.coreFunctionalBChecked.next(isChecked)
      }
    })
    this.functionalGroupChecked.subscribe((isChecked) => {
      if (isChecked != undefined) {
        this.functionalAChecked.next(isChecked)
        this.functionalBChecked.next(isChecked)
      }
    })
    this.analyticsGroupChecked.subscribe((isChecked) => {
      if (isChecked != undefined) {
        this.analyticsAChecked.next(isChecked)
        this.analyticsBChecked.next(isChecked)
      }
    })
    this.adsGroupChecked.subscribe((isChecked) => {
      if (isChecked != undefined) {
        this.adsAChecked.next(isChecked)
        this.adsBChecked.next(isChecked)
      }
    })
    this.otherGroupChecked.subscribe((isChecked) => {
      if (isChecked != undefined) {
        this.otherAChecked.next(isChecked)
        this.otherBChecked.next(isChecked)
      }
    })
  }

  async onCloseClick() {
    await this.modalController.dismiss()
  }

  preventEventPropagation(event: Event) {
    event.stopPropagation()
  }
}
