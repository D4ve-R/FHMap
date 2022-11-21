import {Config, configDimUnit} from "./Config";

export const dimInch = "inch";

export const dimMeter = "m";

export const dimCentiMeter = "cm";

export const dimMilliMeter = "mm";

export const cmPerFoot = 30.48;
export const pixelsPerFoot = 15.0;
//export const cmPerPixel = cmPerFoot * (1.0 / pixelsPerFoot);
export const cmPerPixel = 1.0;
export const pixelsPerCm = 1.0 / cmPerPixel;

export class Dimensions {
   /** Converts cm to dimensioning string.
	* @param cm Centi meter value to be converted.
	* @returns String representation.
	*/
   static cmToMeasure(cm) {
	 switch (Config.getStringValue(configDimUnit)) {
	   case dimInch:
		 const realFeet = ((cm * 0.393700) / 12);
		 const feet = Math.floor(realFeet);
		 const inches = Math.round((realFeet - feet) * 12);
		 return feet + "'" + inches + '"';
	   case dimMilliMeter:
		 return "" + Math.round(10 * cm) + " mm";
	   case dimCentiMeter:
		 return "" + Math.round(10 * cm) / 10 + " cm";
	   case dimMeter:
	   default:
		 return "" + Math.round(10 * cm) / 1000 + " m";
	 }
   }
}