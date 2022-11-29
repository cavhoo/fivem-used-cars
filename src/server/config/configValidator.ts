import Joi from 'joi';
import { Database } from './fragments/database';

export interface IComConfig {
  database: {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
  };
  blips: { type: number; label: string; location: number[] }[];
}

export abstract class ConfigValidator {
  public static joi = Joi.object().keys({
    database: Database.joi,
    blips: Joi.array()
      .optional()
      .items(
        Joi.object().keys({
          type: Joi.number(),
          label: Joi.string(),
          location: Joi.array().items(Joi.number()),
        }),
      ),
  });

  public static validate(input: unknown): input is IComConfig {
    console.log(ConfigValidator.joi.validate(input).error);
    return !ConfigValidator.joi.validate(input).error;
  }
}
