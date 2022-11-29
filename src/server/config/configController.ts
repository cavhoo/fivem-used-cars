import { readFile } from "fs/promises";
import { ConfigValidator, IComConfig } from "./configValidator";

export class ConfigController {
  public static async loadConfig(path: string): Promise<IComConfig | null> {
    const configFile = await readFile(path, { encoding: "utf-8" });
    if (!configFile) {
      console.error("Could not find config at ", path);
      return null;
    }

    return this.parseConfig(configFile);
  }

  private static parseConfig(rawConfig: string): IComConfig | null {
    const parsedConfig = JSON.parse(rawConfig);
    if (ConfigValidator.validate(parsedConfig)) {
      return parsedConfig;
    } else {
      return null;
    }
  }
}
