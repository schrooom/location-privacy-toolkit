export class LocationOption {
  type: ILocationOptionType
  value?: any

  constructor(type: ILocationOptionType) {
    this.type = type
    this.value = type.defaultValue
  }

  static extractedValue(option: LocationOption | undefined): any {
    if (option) {
      const steps = option.type.steps
      if (steps && steps.length > option.value) {
        return steps[option.value]
      }
      return option.value
    }
    return undefined
  }

  static privacyLevel(option: LocationOption): LocationPrivacyLevel {
    const privacyLevel = option.value / (this.getChoices(option) - 1)
    const privacyLevels = Object.keys(LocationPrivacyLevel).length / 2 - 1
    return privacyLevels - privacyLevel * privacyLevels
  }

  static qualityLevel(option: LocationOption): LocationQualityLevel {
    const usabilityLevel = option.value / (this.getChoices(option) - 1)
    const usabilityLevels = Object.keys(LocationQualityLevel).length / 2 - 1
    return usabilityLevel * usabilityLevels
  }

  static combinedPrivacyLevel(options: LocationOption[]): LocationPrivacyLevel {
    const privacyLevels = options
      // exclude non-expert options, since these are basically controlling the expert options
      .filter((o) => o.type.isExpertOption)
      .map((o) => Number(LocationOption.privacyLevel(o)))
      .reduce((a, b) => a + b, 0)
    return privacyLevels / options.length
  }

  static combinedQualityLevel(options: LocationOption[]): LocationQualityLevel {
    const usabilityLevels = options
      // exclude non-expert options, since these are basically controlling the expert options
      .filter((o) => o.type.isExpertOption)
      .map((o) => Number(LocationOption.qualityLevel(o)))
      .reduce((a, b) => a + b, 0)
    return usabilityLevels / options.length
  }

  private static getChoices(option: LocationOption): number {
    if (option.type.steps) {
      return option.type.steps.length
    }
    return 2
  }
}

export enum LocationOptionTypeIdentifier {
  simple = 'simple',
  continuousAccess = 'continuousAccess',
  punctualAccess = 'punctualAccess',
  accuracy = 'accuracy',
  interval = 'interval',
  autoRemoval = 'autoRemoval',
}

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

export interface ILocationOptionType {
  id: string
  dataType: LocationOptionDataType
  isExpertOption: boolean

  privacyPreset: any
  compromisePreset: any
  serviceQualityPreset: any

  icon?: string
  groupId?: string
  steps?: number[]
  defaultValue?: any
}
