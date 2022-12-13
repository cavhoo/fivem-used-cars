import mysql2 from 'mysql2/promise';

export interface IDatabaseOptions {
  user: string;
  password: string;
  host: string;
  port?: number;
  database: string;
}

export enum Tables {
  INVENTORY = 'usedcars_inventory',
  TESTDRIVES = 'usedcars_testdrives',
}

export class Database {
  private static _connectionPool: mysql2.Pool;

  static async connect({ user, password, host, database }: IDatabaseOptions): Promise<void> {
    this._connectionPool = mysql2.createPool({
      user,
      password,
      host,
      database,
    });
  }

  /**
   * Run a simple database query without any dynamic values.
   * For example getting all entries on one table.
   */
  static async executeSimpleQuery<T>(query: string): Promise<T[]> {
    if (!Database._connectionPool) {
      throw new Error('No database connection available');
    }
    const [rows, _] = await this._connectionPool.execute(query);

    return rows as T[];
  }

  /**
   * Run a parameterized query.
   * This is useful when you need to select a subset of data.
   */
  static async executeParamQuery<T>(query: string, values: unknown[]): Promise<T[]> {
    if (!Database._connectionPool) {
      throw new Error('No database connection available.');
    }
    const [rows, _] = await this._connectionPool.execute(query, values);
    return rows as T[];
  }

  /**
   * Create the tables that we need for the script.
   */
  static async createTables(): Promise<void> {
    // Creating the inventory table.
    await Database.executeSimpleQuery(
      `CREATE TABLE IF NOT EXISTS ${Tables.INVENTORY} (uuid VARCHAR(32), owner TEXT, plate TEXT, mods TEXT, price int, model TEXT, displayName TEXT, PRIMARY KEY (uuid));`,
    );

    // Creating the testdrive table.
    await Database.executeSimpleQuery(
      `CREATE TABLE IF NOT EXISTS ${Tables.TESTDRIVES} (uuid VARCHAR(32), driver TEXT, starttime TEXT, endtime TEXT, model TEXT, PRIMARY KEY (uuid));`,
    );
  }
}
