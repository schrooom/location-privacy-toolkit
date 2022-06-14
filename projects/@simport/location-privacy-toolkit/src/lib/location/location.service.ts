import { Injectable } from '@angular/core'
import {
  Geolocation,
  Position,
  PermissionStatus,
  GeolocationPluginPermissions,
} from '@capacitor/geolocation'
import { Platform } from '@ionic/angular'
import { LocationManagementService } from '../location-management/location-management.service'
import { LocationOptionTypeIdentifier } from '../location-management/location-management.types'

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private callbackID: string | undefined = undefined

  constructor(
    private locationManagementService: LocationManagementService,
    private platform: Platform
  ) {
    this.locationManagementService.locationOptions.subscribe(
      async (newOptions) => {
        if (!newOptions || !newOptions.length) return
        const canUseNavigation =
          await this.locationManagementService.loadLocationOption(
            LocationOptionTypeIdentifier.continuousAccess
          )
        if (!canUseNavigation) {
          this.removeListener()
        }
      }
    )
  }

  async canUseLocation(requestPermission: Boolean = false): Promise<Boolean> {
    const locationOption =
      await this.locationManagementService.loadLocationOption(
        LocationOptionTypeIdentifier.punctualAccess
      )
    if (locationOption && locationOption.value) {
      try {
        var status = await Geolocation.checkPermissions()
        if (
          requestPermission &&
          this.needsLocationAccessRequestForStatus(status)
        ) {
          status = await Geolocation.requestPermissions()
        }
        return (
          status.location === 'granted' || status.coarseLocation === 'granted'
        )
      } catch (e) {
        const isApp = this.platform.is('android') || this.platform.is('ios')
        return !isApp
      }
    }
    return false
  }

  async needsLocationAccessRequest(): Promise<Boolean> {
    const status = await Geolocation.checkPermissions()
    return this.needsLocationAccessRequestForStatus(status)
  }

  async requestLocationAccess(): Promise<Boolean> {
    try {
      const permissions: GeolocationPluginPermissions = {
        permissions: ['location', 'coarseLocation'],
      }
      const status = await Geolocation.requestPermissions(permissions)
      return (
        status.location === 'granted' || status.coarseLocation === 'granted'
      )
    } catch (e) {
      const isApp = this.platform.is('android') || this.platform.is('ios')
      return !isApp
    }
  }

  private needsLocationAccessRequestForStatus(
    status: PermissionStatus
  ): Boolean {
    return (
      status.location === 'prompt' ||
      status.location === 'prompt-with-rationale' ||
      status.coarseLocation === 'prompt' ||
      status.coarseLocation === 'prompt-with-rationale'
    )
  }

  async registerListener(callback: (location: Position) => void) {
    const locationOption =
      await this.locationManagementService.loadLocationOption(
        LocationOptionTypeIdentifier.continuousAccess
      )
    if (locationOption && locationOption.value) {
      if (this.callbackID) return
      this.callbackID = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
        },
        async (position: Position | null, err?: any) => {
          if (position) {
            const processedPosition =
              await this.locationManagementService.processLocation(position)
            if (processedPosition) {
              callback(processedPosition)
            }
          }
        }
      )
    }
  }

  async getCurrentLocation(): Promise<Position | undefined> {
    const canUseLocation = await this.canUseLocation()
    if (canUseLocation) {
      const position = await Geolocation.getCurrentPosition()
      return await this.locationManagementService.processLocation(position)
    }
    return undefined
  }

  // Remove all listeners
  removeListener() {
    if (!this.callbackID) return
    Geolocation.clearWatch({ id: this.callbackID })
    this.callbackID = undefined
  }
}
