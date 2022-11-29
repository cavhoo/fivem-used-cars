import { Query as MySQLQuery} from "mysql2";
import { Database } from "./database";

interface IQuery {
  toString(): string;
  execute<T>(): Promise<T>;
}

class Where {
  private _clause: string = "where ";
  constructor(rawQuery: string) {
    this._clause = rawQuery;
  }

  public and(column: string): Where{
    this._clause = `${this._clause} ${column}`;
    return this;
  }

  public or(column: string): Where {
    this._clause = `${this._clause} ${column}`;
    return this;
  }

  public like(value: string): Omit<Where, "like" | "equals"> {
    this._clause = `${this._clause} like ${value}`;
    return this;
  }

  public equals(value: string): Omit<Where, "like" | "equals"> {
    this._clause = `${this._clause} = ${value}`;
    return this;
  }

  public toString(): string {
    return this._clause;
  }

  public async execute<T>(): Promise<T[]> {
    return await Database.executeSimpleQuery<T>(this.toString());
  }
}

export class SelectQuery implements IQuery {
  private _queryString = "";
  constructor(columns?: string[] | string) {
    this._queryString = `${this._queryString} select ${
      !columns ? "*" : Array.isArray(columns) ? columns.join(",") : columns
    } from`;
  }

  public from(table: string): Omit<SelectQuery, "from"> {
    this._queryString = `${this._queryString} ${table}`;
    return this;
  }

  public where(column: string): Where {
    this._queryString = `${this._queryString} where`;
    return new Where(this._queryString);
  }

  public toString(): string {
    return this._queryString;
  }

  public async execute<T>(): Promise<T> {
    return await (await Database.executeSimpleQuery<T>(this.toString())).pop();
  }
}

export class UpdateQuery implements IQuery {
  private _queryString = "";
  constructor(table: string) {
    this._queryString = `update ${table}`;
  }

  public set(column: string, value: any): UpdateQuery {
    this._queryString = `${this._queryString} set ${column}=${value}`;
    return this;
  }

  public where(column: string): Where {
    this._queryString = `${this._queryString} where`;
    return new Where(this._queryString);
  }

  public toString(): string {
    return this._queryString;
  }

  public async execute<T>(): Promise<T> {
    return await (await Database.executeSimpleQuery<T>(this.toString())).pop();
  }
}

export class Query {
  public static Select(
    columns?: string[] | string
  ): Omit<SelectQuery, "where"> {
    return new SelectQuery(columns);
  }

  public static Update(table: string): Omit<UpdateQuery, "where"> {
    return new UpdateQuery(table);
  }
}
