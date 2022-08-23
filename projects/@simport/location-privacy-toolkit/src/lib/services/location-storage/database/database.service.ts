import { Injectable } from '@angular/core'
import {
  CapacitorSQLite,
  SQLiteDBConnection,
  SQLiteConnection,
  capSQLiteSet,
  capSQLiteChanges,
} from '@capacitor-community/sqlite'
import { Position } from '@capacitor/geolocation'
import { Platform } from '@ionic/angular'
import { MIGRATIONS, runMigrations } from './migrations'

export enum PositionType {
  RECORD = 'record',
  EXAMPLE = 'example',
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  // construct query & values array in chunks to prevent to many sql-statements at once
  // since the length limit of a query 'SQLITE_MAX_SQL_LENGTH' defaults to 1 000 000
  private static chunkSize = 1000

  private sqlite = CapacitorSQLite
  private sqliteConnection: SQLiteConnection | undefined = undefined
  private db: SQLiteDBConnection | undefined = undefined
  private dbReady: Promise<void> | undefined = undefined

  constructor(private platform: Platform) {}

  private ensureDbReady() {
    // call this.initDb() exactly once and return the resulting promise.
    if (this.dbReady) return this.dbReady
    return (this.dbReady = this.initDb())
  }

  private async initDb() {
    // TODO: if (this.platform.is('android')) await CapacitorSQLite.requestPermissions()
    this.sqliteConnection = new SQLiteConnection(this.sqlite)

    if (
      this.platform.is('desktop') ||
      this.platform.is('mobileweb') ||
      this.platform.is('electron') ||
      this.platform.is('pwa')
    ) {
      await customElements.whenDefined('jeep-sqlite')
      const jeepSqliteEl = document.querySelector('jeep-sqlite')
      if (jeepSqliteEl != null) {
        await this.sqliteConnection.initWebStore()
      }
    }

    this.db = await this.sqliteConnection.createConnection(
      'locations',
      false,
      'no-encryption',
      1
    )

    await this.db.open()
    await runMigrations(this.db, MIGRATIONS)
  }

  async getLocations(locationType: PositionType): Promise<Position[]> {
    await this.ensureDbReady()

    const sqliteValues = await this.db?.query(
      'SELECT * FROM locations; WHERE type=?;',
      [locationType]
    )
    const values: {
      time: number
      lat: number
      lon: number
      accuracy?: number
      altitude?: number
      altitudeAccuracy?: number
      heading?: number
      speed?: number
      name?: string
      type?: string
    }[] = sqliteValues?.values ?? []
    if (!values.length) return []

    const locations: Position[] = await Promise.all(
      values.map(async (p) => {
        const location: Position = {
          coords: {
            latitude: p.lat,
            longitude: p.lon,
            accuracy: p.accuracy ?? -1,
            altitude: p.altitude ?? null,
            altitudeAccuracy: p.altitudeAccuracy,
            heading: p.heading ?? null,
            speed: p.speed ?? null,
          },
          timestamp: p.time * 1000,
        }
        return location
      }, [])
    )

    return locations
  }

  async insertLocations(locations: Position[], locationType: PositionType) {
    await this.ensureDbReady()

    const length = locations.length

    for (
      let chunkIndex = 0, locIndex = 0;
      chunkIndex < length;
      chunkIndex += DatabaseService.chunkSize
    ) {
      const placeholders = []
      const values = []
      for (
        ;
        locIndex < chunkIndex + DatabaseService.chunkSize && locIndex < length;
        locIndex++
      ) {
        const location = locations[locIndex]

        placeholders.push(`(?,?,?,?,?,?,?,?,?,?)`)
        values.push(
          new Date(location.timestamp),
          location.coords.latitude,
          location.coords.longitude,
          location.coords.accuracy,
          location.coords.altitude,
          location.coords.altitudeAccuracy,
          location.coords.heading,
          location.coords.speed,
          '',
          locationType
        )
      }

      const placeholderString = placeholders.join(', ')
      const statement = `INSERT OR REPLACE INTO locations VALUES ${placeholderString}`
      const set: capSQLiteSet[] = [{ statement, values: values.map(normalize) }]
      const sqLiteChanges: capSQLiteChanges | undefined =
        await this.db?.executeSet(set)
      if (sqLiteChanges && sqLiteChanges.changes?.changes === -1) {
        throw new Error(`couldnt insert locations`)
      }
    }
  }

  async deleteLocation(location: Position) {
    await this.ensureDbReady()

    const statement = `DELETE FROM locations WHERE lat='${
      location.coords.latitude
    } AND lon='${location.coords.longitude} AND time='${new Date(
      location.timestamp
    )}';`
    const sqLiteChanges: capSQLiteChanges | undefined = await this.db?.run(
      statement
    )

    if (sqLiteChanges && sqLiteChanges.changes?.changes === -1)
      throw new Error(`couldnt delete location`)
  }
}

type SqlValue = Date | number | string | object | null | undefined

// Normalize values into a format accepted by sqlite, which is not handled correctly by
// the SqlitePlugin. There are platform-specific (sqlite-version specific?) differences.
// Does not do sql-escaping, this is done by the sql driver.
function normalize(v: SqlValue): string | null | undefined {
  if (v === undefined || v === null) return null

  if (typeof v === 'string') return v

  // max 8 decimals, needed on iOS (emulator at least).
  // handle ints by dropping all trailing 0s
  if (typeof v === 'number') return v.toFixed(8).replace(/\.?0+$/, '')

  // convert date to timestamp (in seconds)
  if (v instanceof Date) return Math.floor(v.getTime() / 1000).toString()

  if (v instanceof Object) return JSON.stringify(v)

  return null
}
