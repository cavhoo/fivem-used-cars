import mysql2 from "mysql2";

export class Database {
  private static _connectionPool: mysql2.Pool;

  static async connect(connectionString: string): Promise<void> {
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
  static async executeSimpleQuery(
    query: string
  ): Promise<mysql2.Query> {
    if (!Database._connectionPool) {
      throw new Error("No database connection available");
    }
    return await this._connectionPool.query(query);
  }

  /**
   * Run a parameterized query.
   * This is useful when you need to select a subset of data.
   */
  static async executeParamQuery(
    query: string,
    values: unknown[]
  ): Promise<mysql2.Query> {
    if (!Database._connectionPool) {
      throw new Error("No database connection available.");
    }

    return await this._connectionPool.query(query, values);
  }
}
