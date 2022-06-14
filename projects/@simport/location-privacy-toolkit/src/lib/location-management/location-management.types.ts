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
    const privacyLevel = option.value / this.getChoices(option)
    const privacyLevels = Object.keys(LocationPrivacyLevel).length / 2 - 1
    return privacyLevels - privacyLevel * privacyLevels
  }

  static qualityLevel(option: LocationOption): LocationQualityLevel {
    const usabilityLevel = option.value / this.getChoices(option)
    const usabilityLevels = Object.keys(LocationQualityLevel).length / 2 - 1
    return usabilityLevel * usabilityLevels
  }

  static combinedPrivacyLevel(options: LocationOption[]): LocationPrivacyLevel {
    const privacyLevels = options
      .map((o) => Number(LocationOption.privacyLevel(o)))
      .reduce((a, b) => a + b, 0)
    return privacyLevels / options.length
  }

  static combinedQualityLevel(options: LocationOption[]): LocationQualityLevel {
    const usabilityLevels = options
      .map((o) => Number(LocationOption.qualityLevel(o)))
      .reduce((a, b) => a + b, 0)
    return usabilityLevels / options.length
  }

  private static getChoices(option: LocationOption): number {
    if (option.type.dataType == LocationOptionDataType.boolean) {
      return 2
    } else if (option.type.steps) {
      return option.type.steps.length - 1
    }
    return 1
  }
}

export enum LocationOptionTypeIdentifier {
  continuousAccess = 'continuousAccess',
  punctualAccess = 'punctualAccess',
  accuracy = 'accuracy',
  interval = 'interval',
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
  title: string
  subtitle: string
  description: string
  dataType: LocationOptionDataType

  optionDescription?: string
  icon?: string
  groupId?: string
  steps?: number[]
  stepLabels?: string[]
  defaultValue?: any
}
