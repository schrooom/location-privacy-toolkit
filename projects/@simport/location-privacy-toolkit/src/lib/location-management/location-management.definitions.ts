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
  defaultValue: true,
}

export const LocationPunctualAccessOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.punctualAccess,
  title: `location-option.${LocationOptionTypeIdentifier.punctualAccess}.title`,
  dataType: LocationOptionDataType.boolean,
  subtitle: `location-option.${LocationOptionTypeIdentifier.punctualAccess}.subtitle`,
  description: `location-option.${LocationOptionTypeIdentifier.punctualAccess}.description`,
  optionDescription: `location-option.${LocationOptionTypeIdentifier.punctualAccess}.detailDescription`,
  icon: 'flash-outline',
  defaultValue: true,
}

export const LocationAccuracyOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.accuracy,
  title: `location-option.${LocationOptionTypeIdentifier.accuracy}.title`,
  dataType: LocationOptionDataType.number,
  subtitle: `location-option.${LocationOptionTypeIdentifier.accuracy}.subtitle`,
  description: `location-option.${LocationOptionTypeIdentifier.accuracy}.description`,
  optionDescription: `location-option.${LocationOptionTypeIdentifier.accuracy}.detailDescription`,
  icon: 'pin-outline',
  steps: [1000, 500, 100, 0],
  stepLabels: [
    'very coarse',
    'coarse',
    'fairly accurate',
    'as accurate as possible',
  ],
  defaultValue: 0,
}

export const LocationIntervalOptionType: ILocationOptionType = {
  id: LocationOptionTypeIdentifier.interval,
  title: `location-option.${LocationOptionTypeIdentifier.interval}.title`,
  dataType: LocationOptionDataType.number,
  subtitle: `location-option.${LocationOptionTypeIdentifier.interval}.subtitle`,
  description: `location-option.${LocationOptionTypeIdentifier.interval}.description`,
  optionDescription: `location-option.${LocationOptionTypeIdentifier.interval}.detailDescription`,
  icon: 'timer-outline',
  steps: [1800, 600, 60, 0],
  stepLabels: [
    'very infrequent',
    'infrequent',
    'fairly frequent',
    'as frequent as possible',
  ],
  defaultValue: 0,
}
