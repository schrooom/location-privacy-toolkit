import {
  ILocationOptionType,
  LocationOptionTypeIdentifier,
} from './location-management.types'

export enum LocationOptionDataType {
  boolean = 'boolean',
  number = 'number',
}

export enum LocationPrivacyLevel {
  low = 0,
  mediumLow = 1,
  mediumHigh = 2,
  high = 3,
}

export enum LocationQualityLevel {
  low = 0,
  mediumLow = 1,
  mediumHigh = 2,
  high = 3,
}

export const LocationContinuousOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.continuousAccess,
  dataType: LocationOptionDataType.boolean,
  icon: 'repeat-outline',
  isExpertOption: true,
  defaultValue: true,
  privacyPreset: false,
  compromisePreset: true,
  serviceQualityPreset: true,
}

export const LocationPunctualAccessOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.punctualAccess,
  dataType: LocationOptionDataType.boolean,
  icon: 'flash-outline',
  isExpertOption: true,
  defaultValue: true,
  privacyPreset: true,
  compromisePreset: true,
  serviceQualityPreset: true,
}

export const LocationAccuracyOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.accuracy,
  dataType: LocationOptionDataType.number,
  icon: 'pin-outline',
  isExpertOption: true,
  steps: [1000, 500, 100, 0],
  defaultValue: 0,
  privacyPreset: 0,
  compromisePreset: 2,
  serviceQualityPreset: 3,
}

export const LocationIntervalOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.interval,
  dataType: LocationOptionDataType.number,
  icon: 'timer-outline',
  isExpertOption: true,
  steps: [1800, 600, 60, 0],
  defaultValue: 0,
  privacyPreset: 0,
  compromisePreset: 2,
  serviceQualityPreset: 3,
}

export const LocationSimpleOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.simple,
  dataType: LocationOptionDataType.number,
  isExpertOption: false,
  steps: [0, 1, 2],
  defaultValue: 0,
  privacyPreset: 0,
  compromisePreset: 1,
  serviceQualityPreset: 2,
}

export class LocationOptionUtility {
  private static prefix = 'simport-location-privacy-toolkit.location-option.'

  static getTitle(identifier: LocationOptionTypeIdentifier | string) {
    return LocationOptionUtility.getString(identifier, 'title')
  }

  static getSubtitle(identifier: LocationOptionTypeIdentifier | string) {
    return LocationOptionUtility.getString(identifier, 'subtitle')
  }

  static getDescription(identifier: LocationOptionTypeIdentifier | string) {
    return LocationOptionUtility.getString(identifier, 'description')
  }

  static getDetailDescription(
    identifier: LocationOptionTypeIdentifier | string
  ) {
    return LocationOptionUtility.getString(identifier, 'detailDescription')
  }

  static getStepLabel(
    identifier: LocationOptionTypeIdentifier | string,
    level: number
  ): string {
    return LocationOptionUtility.getString(identifier, `level${level}`)
  }

  private static getString(
    identifier: LocationOptionTypeIdentifier | string,
    substring: string
  ) {
    return `${LocationOptionUtility.prefix}${identifier}.${substring}`
  }
}
