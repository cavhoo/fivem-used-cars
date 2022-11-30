import { Database } from "./database";

interface IQuery<T> {
  toString(): string;
  execute(): Promise<T | T[]>;
}

class Where<T> {
  private _clause: string = "where ";
  constructor(rawQuery: string) {
    this._clause = rawQuery;
  }

  public and(column: keyof T): Where<T>{
    this._clause = `${this._clause} ${String(column)}`;
    return this;
  }

  public or(column: keyof T): Where<T> {
    this._clause = `${this._clause} ${String(column)}`;
    return this;
  }

  public like(value: string | number): Omit<Where<T>, "like" | "equals"> {
    this._clause = `${this._clause} like ${value}`;
    return this;
  }

  public equals(value: string | number): Omit<Where<T>, "like" | "equals"> {
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

export class SelectQuery<T> implements IQuery<T> {
  private _queryString = "";
  constructor(columns?: (keyof T)[] | keyof T | string) {
    this._queryString = `${this._queryString} select ${
      !columns ? "*" : Array.isArray(columns) ? columns.join(",") : String(columns)
    } from`;
  }

  public from(table: string): Omit<SelectQuery<T>, "from"> {
    this._queryString = `${this._queryString} ${table}`;
    return this;
  }

  public where(column: keyof T): Where<T> {
    this._queryString = `${this._queryString} where ${String(column)}`;
    return new Where(this._queryString);
  }

  public toString(): string {
    return this._queryString;
  }

  public async execute(): Promise<T[]> {
    return await (await Database.executeSimpleQuery<T>(this.toString()));
  }
}

export class UpdateQuery<T> implements IQuery<T> {
  private _queryString = "";
  constructor(table: string) {
    this._queryString = `update ${table}`;
  }

  public set(column: keyof T, value: any): UpdateQuery<T> {
    this._queryString = `${this._queryString} set ${String(column)}=${value}`;
    return this;
  }

  public where(column: keyof T): Where<T> {
    this._queryString = `${this._queryString} where ${String(column)}`;
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
  public static Select<T>(
    columns?: (keyof T)[] | keyof T | string
  ): Omit<SelectQuery<T>, "where"> {
    return new SelectQuery<T>(columns);
  }

  public static Update<T>(table: string): Omit<UpdateQuery<T>, "where"> {
    return new UpdateQuery<T>(table);
  }
}
