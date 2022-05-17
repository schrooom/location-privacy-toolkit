import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Storage } from '@capacitor/storage'
import { LocationOption, LocationOptionType } from './location-management'
import { Position } from '@capacitor/geolocation'
import { point } from '@turf/helpers'
import { randomPoint } from '@turf/random'
import buffer from '@turf/buffer'
import bbox from '@turf/bbox'
import transformTranslate from '@turf/transform-translate'

@Injectable({
  providedIn: 'root',
})
export class LocationManagementService {
  locationOptions: BehaviorSubject<LocationOption[]> = new BehaviorSubject<
    LocationOption[]
  >([])
  private cachedPosition: Position | undefined = undefined

  static LOCATION_OPTIONS_STORAGE_KEY = 'location_options_storage'
  static LOCATION_OPTIONS_STORAGE_VERISON_KEY =
    'location_options_storage_version'
  static LOCATION_OPTIONS_CURRENT_VERSION = '0'

  private get defaultOptions(): LocationOption[] {
    return [
      new LocationOption(LocationOptionType.playgrounds),
      new LocationOption(LocationOptionType.navigation),
      new LocationOption(LocationOptionType.accuracy),
      new LocationOption(LocationOptionType.interval),
    ]
  }

  constructor() {
    this.locationOptions.subscribe(async (newOptions) => {
      if (!newOptions || !newOptions.length) return
      await Storage.set({
        key: LocationManagementService.LOCATION_OPTIONS_STORAGE_KEY,
        value: JSON.stringify(newOptions),
      })
    })
    this.initLocationOptions()
  }

  async initLocationOptions() {
    await this.checkVersion()
    const { value } = await Storage.get({
      key: LocationManagementService.LOCATION_OPTIONS_STORAGE_KEY,
    })
    if (value && value.length > 0) {
      try {
        const options = JSON.parse(value) as LocationOption[]
        if (options.length > 0) {
          this.locationOptions.next(options)
          return
        }
      } catch (error) {}
    }
    this.locationOptions.next(this.defaultOptions)
  }

  private async checkVersion(): Promise<void> {
    const { value } = await Storage.get({
      key: LocationManagementService.LOCATION_OPTIONS_STORAGE_VERISON_KEY,
    })
    if (value !== LocationManagementService.LOCATION_OPTIONS_CURRENT_VERSION) {
      if (value) {
        await Storage.remove({
          key: LocationManagementService.LOCATION_OPTIONS_STORAGE_KEY,
        })
      }
      await Storage.set({
        key: LocationManagementService.LOCATION_OPTIONS_STORAGE_VERISON_KEY,
        value: LocationManagementService.LOCATION_OPTIONS_CURRENT_VERSION,
      })
    }
  }

  async loadLocationOption(
    type: LocationOptionType
  ): Promise<LocationOption | undefined> {
    if (!this.locationOptions) {
      await this.initLocationOptions()
    }
    return this.locationOptions
      .getValue()
      .find((o) => (o.type as LocationOptionType) === type)
  }

  async processLocation(position: Position): Promise<Position | undefined> {
    try {
      if (await this.shouldUseCachedPosition()) {
        // return cached position if eligible
        return this.filterPositionWithAccuracy(this.cachedPosition)
      }
      if (position) {
        this.cachedPosition = await this.filterPositionWithAccuracy(position)
        return this.cachedPosition
      }
      return undefined
    } catch (e) {
      return undefined
    }
  }

  private async shouldUseCachedPosition(): Promise<boolean> {
    const locationIntervalOption = await this.loadLocationOption(
      LocationOptionType.interval
    )
    const locationInterval = LocationOption.extractedValue(
      locationIntervalOption
    )
    if (this.cachedPosition && this.cachedPosition.coords) {
      const timestamp = Date.now()
      const timeDiff = timestamp - this.cachedPosition.timestamp
      return timeDiff < locationInterval * 1000
    }
    return false
  }

  private async filterPositionWithAccuracy(
    position: Position | undefined
  ): Promise<Position | undefined> {
    const locationAccuracyOption = await this.loadLocationOption(
      LocationOptionType.accuracy
    )
    const locationAccuracy = LocationOption.extractedValue(
      locationAccuracyOption
    )
    if (!position || !position.coords) {
      return undefined
    } else if (
      position.coords.accuracy &&
      position.coords.accuracy > locationAccuracy
    ) {
      // original accuracy already fits
      return position
    }

    // create random location with accuracy from user
    const positionBuffer = buffer(
      point([position.coords.longitude, position.coords.latitude]),
      locationAccuracy,
      {
        units: 'meters',
      }
    )
    const randomDistance = Math.floor((Math.random() + 0.2) * locationAccuracy)
    const randomDirection = Math.floor(Math.random() * 360)
    const translatedBuffer = transformTranslate(
      positionBuffer,
      randomDistance,
      randomDirection,
      {
        units: 'meters',
      }
    )
    const posBbox = bbox(translatedBuffer)
    const randomPoints = randomPoint(1, { bbox: posBbox })
    const randomPointCoord = randomPoints.features[0].geometry.coordinates
    const newPosition: Position = {
      timestamp: position.timestamp,
      coords: {
        latitude: randomPointCoord[1],
        longitude: randomPointCoord[0],
        accuracy: locationAccuracy + position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        altitude: position.coords.altitude,
        speed: position.coords.speed,
        heading: position.coords.heading,
      },
    }

    return newPosition
  }
}
