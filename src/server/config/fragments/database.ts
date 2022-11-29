import * as Joi from "joi";

export abstract class Database {
  public static joi = Joi.object().keys({
    connectionString: Joi.string(),
  });
}
