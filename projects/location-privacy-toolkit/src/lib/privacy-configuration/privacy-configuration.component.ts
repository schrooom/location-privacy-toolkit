import { Component } from '@angular/core'
import {
  LocationOption,
  LocationOptionType,
  LocationPrivacyLevel,
  LocationQualityLevel,
} from '../location-management/location-management'
import { LocationManagementService } from '../location-management/location-management.service'
import { ModalController, IonRouterOutlet } from '@ionic/angular'
import { PrivacyConfigurationDetailComponent } from './privacy-configuration-detail/privacy-configuration-detail.component'

@Component({
  selector: 'privacy-configuration',
  templateUrl: 'privacy-configuration.component.html',
  styleUrls: ['privacy-configuration.component.scss'],
})
export class PrivacyConfigurationComponent {
  locationOptions: LocationOption[] = []

  constructor(
    private locationManagementService: LocationManagementService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet
  ) {
    this.locationManagementService.locationOptions.subscribe(
      (newOptions: LocationOption[]) => {
        this.locationOptions = newOptions
      }
    )
  }

  get privacyLevel(): LocationPrivacyLevel {
    return LocationOption.combinedPrivacyLevel(this.locationOptions)
  }

  get qualityLevel(): LocationQualityLevel {
    return LocationOption.combinedQualityLevel(this.locationOptions)
  }

  get qualityLevelIcons(): RatingIcons {
    const level = this.qualityLevel
    const full = Math.floor(level)
    const empty = Math.floor(LocationQualityLevel.high - level)
    const half = Math.ceil(level - full)
    return new RatingIcons(full, half, empty)
  }

  get privacyLevelIcons(): RatingIcons {
    const level = this.privacyLevel
    const full = Math.floor(level)
    const empty = Math.floor(LocationPrivacyLevel.high - level)
    const half = Math.ceil(level - full)
    return new RatingIcons(full, half, empty)
  }

  getTitle(type: LocationOptionType): string {
    return LocationOptionType.title(type)
  }

  getSubtitle(type: LocationOptionType): string {
    return LocationOptionType.subtitle(type)
  }

  getDescription(type: LocationOptionType): string {
    return LocationOptionType.description(type)
  }

  getOptionDescription(type: LocationOptionType): string {
    return LocationOptionType.optionDescription(type)
  }

  getIcon(type: LocationOptionType): string {
    return LocationOptionType.icon(type)
  }

  getMinLabel(type: LocationOptionType): string {
    const labels = LocationOptionType.stepLabels(type)
    return labels.length > 0 ? LocationOptionType.stepLabels(type)[0] : ''
  }

  getMaxLabel(type: LocationOptionType): string {
    const labels = LocationOptionType.stepLabels(type)
    return labels.length > 0
      ? LocationOptionType.stepLabels(type)[labels.length - 1]
      : ''
  }

  getType(type: LocationOptionType): string {
    return LocationOptionType.dataType(type)
  }

  getSteps(type: LocationOptionType): number[] {
    return LocationOptionType.steps(type)
  }

  getValueLabel(option: LocationOption): string {
    if (typeof option.value !== 'number') {
      return ''
    }
    switch (option.type) {
      case LocationOptionType.accuracy:
      case LocationOptionType.interval:
        return LocationOptionType.stepLabels(option.type)[option.value]
    }
    return ''
  }

  async showLocationOptionDetails(type: LocationOptionType) {
    await this.showDetails(
      this.getTitle(type),
      this.getSubtitle(type),
      this.getDescription(type),
      this.getOptionDescription(type),
      this.getIcon(type)
    )
  }

  private async showRatingDetails(
    baseString: string,
    icon: string,
    iconClass?: string
  ) {
    await this.showDetails(
      `location-option.rating.${baseString}.title`,
      `location-option.rating.${baseString}.subtitle`,
      `location-option.rating.${baseString}.description`,
      `location-option.rating.${baseString}.detailDescription`,
      icon,
      iconClass
    )
  }

  private async showDetails(
    title: string,
    subtitle: string,
    description: string,
    detailDescription: string,
    icon: string,
    iconClass?: string
  ) {
    const modal = await this.modalController.create({
      component: PrivacyConfigurationDetailComponent,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
      cssClass: 'auto-height',
      componentProps: {
        title,
        subtitle,
        description,
        detailDescription,
        icon,
        iconClass,
      },
    })
    await modal.present()
  }

  onOptionChange() {
    this.locationManagementService.locationOptions.next(this.locationOptions)
  }

  async onPrivacyRatingDetailsClick() {
    await this.showRatingDetails('privacy', 'shield')
  }

  async onQualityRatingDetailsClick() {
    await this.showRatingDetails('quality', 'star')
  }
}

export class RatingIcons {
  full: any[]
  half: any[]
  empty: any[]

  constructor(full: number, half: number, empty: number) {
    this.full = new Array(full)
    this.half = new Array(half)
    this.empty = new Array(empty)
  }
}
