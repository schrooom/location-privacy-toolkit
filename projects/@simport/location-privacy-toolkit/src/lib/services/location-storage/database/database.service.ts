import { Injectable } from '@angular/core'
import {
  CapacitorSQLite,
  SQLiteDBConnection,
  SQLiteConnection,
} from '@capacitor-community/sqlite'
import { Platform } from '@ionic/angular'
import { MIGRATIONS, runMigrations } from './migrations'

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite = CapacitorSQLite
  private sqliteConnection: SQLiteConnection | undefined = undefined
  private db: SQLiteDBConnection | undefined = undefined
  private dbReady: Promise<void> | undefined = undefined

  constructor(private platform: Platform) {}

  private isSupported() {
    return this.platform.is('hybrid') // equivalent to android && ios
  }

  private ensureDbReady() {
    // call this.initDb() exactly once and return the resulting promise.
    if (this.dbReady) return this.dbReady
    return (this.dbReady = this.isSupported()
      ? this.initDb()
      : new Promise(() => {})) // never resolve..
  }

  private async initDb() {
    // TODO: if (this.platform.is('android')) await CapacitorSQLite.requestPermissions()
    this.sqliteConnection = new SQLiteConnection(this.sqlite)
    this.db = await this.sqliteConnection.createConnection(
      'trajectories',
      false,
      'no-encryption',
      1
    )

    // TODO: ask user to provide encryption password (assuming we keep this sqlite driver..)
    await this.db.open()

    await runMigrations(this.db, MIGRATIONS)
  }
}
