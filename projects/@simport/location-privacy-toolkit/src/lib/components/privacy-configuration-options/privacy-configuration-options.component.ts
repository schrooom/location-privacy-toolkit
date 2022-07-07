import { Component } from '@angular/core'
import { LocationManagementService } from '../../services/location-management/location-management.service'

@Component({
  selector: 'privacy-configuration.option',
  templateUrl: './privacy-configuration-options.component.html',
  styleUrls: ['./privacy-configuration-options.component.scss'],
})
export class PrivacyConfigurationOptionComponent {
  constructor(private locationManagementService: LocationManagementService) {}

  get isExpertModeActive(): Boolean {
    return this.locationManagementService.isExpertMode
  }

  set isExpertModeActive(newValue: Boolean) {
    this.locationManagementService.isExpertMode = newValue
  }

  async onExpertModeClick() {
    this.isExpertModeActive = !this.isExpertModeActive
  }
}
