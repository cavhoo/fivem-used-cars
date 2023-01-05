import Joi from 'joi';
import { Vec3, Blip, Language, Marker } from '../../common';
import { ValidatorBlip, ValidatorMarker } from './fragments/config';
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
  blips: Blip[]; // The blips that are shown on the map.
  markers: Marker[];
  spawnLocation: IShowroomLocation[];
  testDrive: {
    length: number; // The duration of the testdrive in seconds.
  };
  language: Language;
}

export abstract class ConfigValidator {
  public static joi = Joi.object().keys({
    database: Database.joi,
    blips: Joi.array().optional().items(ValidatorBlip.joi),
    markers: Joi.array().optional().items(ValidatorMarker.joi),
    language: Joi.alternatives(['en', 'de']),
    spawnLocation: Joi.array()
      .optional()
      .items(
        Joi.object().keys({
          heading: Joi.number(),
          location: Joi.object().keys({
            x: Joi.number(),
            y: Joi.number(),
            z: Joi.number(),
          }),
        }),
      ),
  });

  public static validate(input: unknown): input is IUsedCarsConfig {
    console.log(ConfigValidator.joi.validate(input).error);
    return !ConfigValidator.joi.validate(input).error;
  }
}
