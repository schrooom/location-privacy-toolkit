import { SQLiteDBConnection } from '@capacitor-community/sqlite'

export async function runMigrations(
  db: SQLiteDBConnection,
  migrations: string[]
) {
  const init = `CREATE TABLE IF NOT EXISTS migrations (
    version integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    up TEXT NOT NULL);`
  const { changes } = await db.execute(init)
  if (changes?.changes === -1) throw new Error(`can't run DB migrations`)

  const { values } = await db.query(
    `SELECT version FROM migrations ORDER BY version DESC LIMIT 1;`
  )
  const currentVersion = values?.length ? parseInt(values[0].version, 10) : 0

  for (let v = currentVersion; v < migrations.length; v++)
    await runMigration(db, migrations[v], v + 1)
}

async function runMigration(
  db: SQLiteDBConnection,
  migration: string,
  targetVersion: number
) {
  // run migrations
  const { changes: changesMigration } = await db.execute(migration)
  if (changesMigration?.changes === -1)
    throw new Error(`DB migration to v${targetVersion} failed`)

  // persist migration-info
  const set = [
    {
      statement: 'INSERT INTO migrations (version, up) VALUES (?, ?);',
      values: [targetVersion, migration],
    },
  ]
  const { changes: changesMigrationInfo } = await db.executeSet(set)
  if (changesMigrationInfo?.changes === -1)
    throw new Error(
      `Persisting DB migration information to v${targetVersion} failed`
    )
}

export const MIGRATIONS = [
  // drop database schema from before migrations introduction
  `DROP TABLE IF EXISTS locations;`,

  // initial schema: locations table
  `CREATE TABLE IF NOT EXISTS locations (
    uuid varchar(255) NOT NULL PRIMARY KEY,
    time DATETIME NOT NULL,
    lat float NOT NULL,
    lon float NOT NULL,
    accuracy float,
    altitude float,
    name varchar(255);`,
]
