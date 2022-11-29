export interface IVehicle {
  /** The gta model hash of the car. */
  model: string;
  /** The human readable name of the car. */
  make :string;
  /** The JSON object with all installed mods. */
  mods: string;
  /** The sell price of the car. */
  price :number;
  /** The player selling the car. */
  seller: string;
  /** License Plate. */
  licensePlate: string;
}