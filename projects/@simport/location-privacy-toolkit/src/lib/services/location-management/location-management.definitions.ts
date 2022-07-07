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
  title: `location-option.${LocationOptionTypeIdentifier.continuousAccess}.title`,
  dataType: LocationOptionDataType.boolean,
  subtitle: `location-option.${LocationOptionTypeIdentifier.continuousAccess}.subtitle`,
  description: `location-option.${LocationOptionTypeIdentifier.continuousAccess}.description`,
  optionDescription: `location-option.${LocationOptionTypeIdentifier.continuousAccess}.detailDescription`,
  icon: 'repeat-outline',
  isExpertOption: true,
  defaultValue: true,
  privacyPreset: false,
  compromisePreset: true,
  serviceQualityPreset: true,
}

export const LocationPunctualAccessOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.punctualAccess,
  title: `location-option.${LocationOptionTypeIdentifier.punctualAccess}.title`,
  dataType: LocationOptionDataType.boolean,
  subtitle: `location-option.${LocationOptionTypeIdentifier.punctualAccess}.subtitle`,
  description: `location-option.${LocationOptionTypeIdentifier.punctualAccess}.description`,
  optionDescription: `location-option.${LocationOptionTypeIdentifier.punctualAccess}.detailDescription`,
  icon: 'flash-outline',
  isExpertOption: true,
  defaultValue: true,
  privacyPreset: true,
  compromisePreset: true,
  serviceQualityPreset: true,
}

export const LocationAccuracyOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.accuracy,
  title: `location-option.${LocationOptionTypeIdentifier.accuracy}.title`,
  dataType: LocationOptionDataType.number,
  subtitle: `location-option.${LocationOptionTypeIdentifier.accuracy}.subtitle`,
  description: `location-option.${LocationOptionTypeIdentifier.accuracy}.description`,
  optionDescription: `location-option.${LocationOptionTypeIdentifier.accuracy}.detailDescription`,
  icon: 'pin-outline',
  isExpertOption: true,
  steps: [1000, 500, 100, 0],
  stepLabels: [
    `location-option.${LocationOptionTypeIdentifier.accuracy}.level0`,
    `location-option.${LocationOptionTypeIdentifier.accuracy}.level1`,
    `location-option.${LocationOptionTypeIdentifier.accuracy}.level2`,
    `location-option.${LocationOptionTypeIdentifier.accuracy}.level3`,
  ],
  defaultValue: 0,
  privacyPreset: 0,
  compromisePreset: 2,
  serviceQualityPreset: 3,
}

export const LocationIntervalOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.interval,
  title: `location-option.${LocationOptionTypeIdentifier.interval}.title`,
  dataType: LocationOptionDataType.number,
  subtitle: `location-option.${LocationOptionTypeIdentifier.interval}.subtitle`,
  description: `location-option.${LocationOptionTypeIdentifier.interval}.description`,
  optionDescription: `location-option.${LocationOptionTypeIdentifier.interval}.detailDescription`,
  icon: 'timer-outline',
  isExpertOption: true,
  steps: [1800, 600, 60, 0],
  stepLabels: [
    `location-option.${LocationOptionTypeIdentifier.interval}.level0`,
    `location-option.${LocationOptionTypeIdentifier.interval}.level1`,
    `location-option.${LocationOptionTypeIdentifier.interval}.level2`,
    `location-option.${LocationOptionTypeIdentifier.interval}.level3`,
  ],
  defaultValue: 0,
  privacyPreset: 0,
  compromisePreset: 2,
  serviceQualityPreset: 3,
}

export const LocationSimpleOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.simple,
  title: `location-option.${LocationOptionTypeIdentifier.simple}.title`,
  dataType: LocationOptionDataType.number,
  subtitle: `location-option.${LocationOptionTypeIdentifier.simple}.subtitle`,
  description: `location-option.${LocationOptionTypeIdentifier.simple}.description`,
  optionDescription: `location-option.${LocationOptionTypeIdentifier.simple}.detailDescription`,
  isExpertOption: false,
  steps: [0, 1, 2],
  stepLabels: [
    `location-option.${LocationOptionTypeIdentifier.simple}.level0`,
    `location-option.${LocationOptionTypeIdentifier.simple}.level1`,
    `location-option.${LocationOptionTypeIdentifier.simple}.level2`,
  ],
  defaultValue: 0,
  privacyPreset: 0,
  compromisePreset: 1,
  serviceQualityPreset: 2,
}
