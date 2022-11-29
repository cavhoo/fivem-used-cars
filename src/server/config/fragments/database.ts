import * as Joi from "joi";

export abstract class Database {
  public static joi = Joi.object().keys({
    host: Joi.string(),
    password: Joi.string(),
    user: Joi.string(),
    port: Joi.number(),
    database: Joi.string(),
  });
}
