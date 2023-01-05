import Joi from 'joi';

export abstract class ValidatorVector3 {
  public static joi = Joi.array().length(3).items(Joi.number());
}

export abstract class ValidatorColor {
  public static joi = Joi.array().length(4).items(Joi.number());
}

export abstract class ValidatorBlip {
  public static joi = Joi.object().keys({
    type: Joi.number(),
    label: Joi.string(),
    location: Joi.array().length(3).items(Joi.number()),
    display: Joi.number(),
    color: Joi.number(),
    scale: Joi.number(),
  });
}

export abstract class ValidatorMarker {
  public static joi = Joi.object().keys({
    type: Joi.number(),
    position: ValidatorVector3.joi.optional(),
    direction: ValidatorVector3.joi.optional(),
    rotation: ValidatorVector3.joi.optional(),
    scale: ValidatorVector3.joi,
    color: ValidatorColor.joi,
    bobbing: Joi.boolean(),
    facesPlayer: Joi.boolean(),
    rotates: Joi.boolean(),
    textureDictionary: Joi.string().optional(),
    textureName: Joi.string().optional(),
  });
}
