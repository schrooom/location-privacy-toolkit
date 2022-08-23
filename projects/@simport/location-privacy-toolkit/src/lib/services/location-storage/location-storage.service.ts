import { Injectable } from '@angular/core'
import { Position } from '@capacitor/geolocation'
import { DatabaseService, PositionType } from './database/database.service'
import {
  ExampleJSON,
  exampleLocations,
} from './location-storage.service.fixtures'
import * as polyline from '@mapbox/polyline'

@Injectable({
  providedIn: 'root',
})
export class LocationStorageService {
  constructor(private databaseService: DatabaseService) {}

  async getAllLocations(): Promise<Position[]> {
    // TODO: return real data
    const locations: Position[] = []
    return locations.sort((a, b) => a.timestamp - b.timestamp)
  }

  async getExampleLocations(): Promise<Position[]> {
    var locations = await this.databaseService.getLocations(
      PositionType.EXAMPLE
    )
    if (locations.length == 0) {
      locations = this.loadPositionFromExampleJSON(exampleLocations)
      await this.databaseService.insertLocations(
        locations,
        PositionType.EXAMPLE
      )
    }

    return locations.sort((a, b) => a.timestamp - b.timestamp)
  }

  async deleteLocation(location: Position) {
    this.databaseService.deleteLocation(location)
  }

  private loadPositionFromExampleJSON({
    coordinates,
    timestamps,
    accuracy,
    speed,
    time0,
  }: ExampleJSON): Position[] {
    const c = polyline.decode(coordinates) as [number, number][]
    const t = timestamps.reduce<number[]>((ts, t, i, deltas) => {
      // The array from the JSON has one element less than locations,
      // as it contains time deltas. To restore absolute dates, we add
      // the first timestamp & in the same iteration also add the first delta
      if (i === 0) ts.push(new Date(time0).getTime())
      const t1 = ts[i]
      const deltaMs = deltas[i] * 1000
      ts.push(t1 + deltaMs)
      return ts
    }, [])
    const a = accuracy || []
    const s = speed || []
    if (c.length === t.length && t.length === a.length) {
      return c.reduce<Position[]>((positions, c, i, _) => {
        const pos: Position = {
          coords: {
            latitude: c[0],
            longitude: c[1],
            accuracy: a.length > i ? a[i] : -1,
            altitude: null,
            altitudeAccuracy: null,
            speed: s.length > i ? s[i] : null,
            heading: null,
          },
          timestamp: t[i],
        }
        positions.push(pos)
        return positions
      }, [])
    }
    return []
  }
}
