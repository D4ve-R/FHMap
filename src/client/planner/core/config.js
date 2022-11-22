import { dimInch, dimCentiMeter, dimMeter } from "./Dimensions";

export const configDimUnit = "dimUnit";

  // WALL:
export const configWallHeight = "wallHeight";

export const configWallThickness = "wallThickness";

export class Config {
	configWallHeight = configWallHeight;
	configWallThickness = configWallThickness;
	
    static data = {
      dimUnit: dimCentiMeter,

      wallHeight: 250,
      wallThickness: 10
    };

    static setValue(key, value) {
      this.data[key] = value;
    }

    static getStringValue(key) {
      switch (key) {
        case configDimUnit:
          return String(this.data[key]);
        default:
          throw new Error("Invalid string configuration parameter: " + key);
      }
    }

    static getNumericValue(key) {
      switch (key) {
        case configWallHeight:
        case configWallThickness:
          return Number(this.data[key]);
        default:
          throw new Error("Invalid numeric configuration parameter: " + key);
      }
    }
}