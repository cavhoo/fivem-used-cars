import mysql2 from "mysql2/promise";

export interface IDatabaseOptions {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export class Database {
  private static _connectionPool: mysql2.Pool;

  static async connect({user, password, host, port, database}: IDatabaseOptions): Promise<void> {
    this._connectionPool = mysql2.createPool({
      user: "com_rp_user",
      password: "hallo123",
      host: "localhost",
      port: 5432,
      database: "com_rp",
    });
  }

  /**
   * Run a simple database query without any dynamic values.
   * For example getting all entries on one table.
   */
  static async executeSimpleQuery<T>(
    query: string
  ): Promise<T[]> {
    if (!Database._connectionPool) {
      throw new Error("No database connection available");
    }
    const [rows, fields] = await this._connectionPool.execute(query);

    return rows as T[];
  }

  /**
   * Run a parameterized query.
   * This is useful when you need to select a subset of data.
   */
  static async executeParamQuery<T>(
    query: string,
    values: unknown[]
  ): Promise<T[]> {
    if (!Database._connectionPool) {
      throw new Error("No database connection available.");
    }
    const [ rows, fields ] = await this._connectionPool.execute(query, values);
    return rows as T[];
  }
}
