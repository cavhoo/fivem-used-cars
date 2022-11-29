import Joi from "joi";

export interface IComConfig {
  database: {
    connectionString: string;
  };
  blips: { type: number; label: string; location: number[] }[];
  pedestrianLevel: number;
  initialSpawnLocation: number[];
}

export abstract class ConfigValidator {
  public static joi = Joi.object().keys({
    database: Joi.object().keys({
      connectionString: Joi.string(),
    }),
    blips: Joi.array()
      .optional()
      .items(
        Joi.object().keys({
          type: Joi.number(),
          label: Joi.string(),
          location: Joi.array().items(Joi.number()),
        })
      ),
    pedestrianLevel: Joi.number(),
    initialSpawnLocation: Joi.array().optional().items(Joi.number()),
  });

  public static validate(input: unknown): input is IComConfig {
    console.log(ConfigValidator.joi.validate(input).error);
    return !ConfigValidator.joi.validate(input).error;
  }
}
