import Joi from 'joi';
import { Vec3 } from '../../common';
import { Database } from './fragments/database';

export interface IUsedCarsTable {
  name: string;
  columns: string[];
}

export interface IShowroomLocation {
  // The coords where the car should spawn.
  location: Vec3;
  // The angle in which the car should spawn.
  heading: number;
}

export interface IUsedCarsConfig {
  database: {
    host: string; // Host where the databse is located.
    user: string; // Username of db user that has access.
    password: string; // Password of the user.
    port: number; // Database connection port.
    database: string; // The name of the database of the fivem server.
    tables: {
      // Table names for the script.
      vehicles: string; // Where the vehicles that are owned are located.
    };
  };
  blips: { type: number; label: string; location: number[] }[]; // The blips that are shown on the map.
  spawnLocation: IShowroomLocation[];
  testDrive: {
    length: number; // The duration of the testdrive in minutes.
  };
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

  public static validate(input: unknown): input is IUsedCarsConfig {
    console.log(ConfigValidator.joi.validate(input).error);
    return !ConfigValidator.joi.validate(input).error;
  }
}
