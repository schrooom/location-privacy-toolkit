import { Injectable } from '@angular/core'
import { Position } from '@capacitor/geolocation'
import { DatabaseService } from './database/database.service'
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
    /*
    var locations: Position[] = []
    for (let index = 0; index < 200; index++) {
      locations.push(this.generateRandomPosition())
    }
    */
    var locations = this.loadPositionFromExampleJSON(exampleLocations)
    return locations.sort((a, b) => a.timestamp - b.timestamp)
  }

  async deleteLocation(location: Position) {
    // TODO: delete location
  }

  private generateRandomPosition(): Position {
    return {
      timestamp: Math.random() * Date.now(),
      coords: {
        latitude: Math.random() * 0.1 + 51.9,
        longitude: Math.random() * 0.2 + 7.5,
        accuracy: Math.random() * 100,
        altitudeAccuracy: Math.random() * 100,
        altitude: Math.random() * 100,
        speed: Math.random() * 100,
        heading: Math.random() * 360,
      },
    }
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
    if (c.length === t.length && t.length === a.length) {
      return c.reduce<Position[]>((positions, c, i, ar) => {
        const pos: Position = {
          coords: {
            latitude: c[0],
            longitude: c[1],
            accuracy: a[i],
            altitude: null,
            altitudeAccuracy: null,
            speed: null,
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
