import { Query } from './database/query';
import { ConfigController } from './config/configController';
import { FiveMServerEvents, FiveMUsedCarsServerEvents } from '../common';
import { Vehicle } from './models/vehicle';
import { Database, Tables } from './database/database';
import { IUsedCarsConfig, IShowroomLocation } from './config/configValidator';

const vehiclesForSale = new Map<string, Vehicle>();
const spawnPointsVehicleMap = new Map<IShowroomLocation, string>();
let config: IUsedCarsConfig;

const loadVehiclesForSale = async (): Promise<Vehicle[]> => {
  const vehicles = await Query.Select<Vehicle>().from(Tables.INVENTORY).execute();
  return vehicles;
};

/** Find the next free showroom spot. */
const getFreeSpawnPoint = (): [IShowroomLocation, string] => {
  return [...spawnPointsVehicleMap.entries()].find(([_, vehicle]) => vehicle === '');
};

/** Action handler when a player sells a vehicle. */
const sellVehicle = async (vehicleId: string) => {
  if (vehiclesForSale.has(vehicleId)) {
    // TODO:
    // 1. Check if the user as enough money
    // 2. Remove money from their bankaccount
    // 3. Add money to the owners bankaccount
    // 4. Transfer vehicle to the new owner
    // 5. Store the vehicle in the garage of new owner, or drive directly?
  } else {
    console.error(`Could not find vehicle with ID: ${vehicleId}. Was it put for sale?`);
  }
};

/** Server side spawning of vehicles on the showroom coords. */
const spawnVehicles = async () => {
  // TODO:
  // 1. Loop through loaded vehicles
  for (let veh in vehiclesForSale) {
    // 2. Take one spawn position of the given locations.
    const [spawnLocation, _] = getFreeSpawnPoint();

    const vehicle = vehiclesForSale.get(veh);

    // Obtain spawnable hash.
    const vehicleHash = GetHashKey(vehicle.model);
    const { location, heading } = spawnLocation;

    // Create the vehicle.
    // 3. Spawn one vehicle per spot.
    const vehicleEntity = CreateVehicle(
      vehicleHash,
      location.x,
      location.y,
      location.z,
      heading,
      true,
      true,
    );
  }
};

const startTestDrive = async () => {
  // TODO:
  // 1. Put vehicle into table for test drives
  // 2. Time limit the test drive.
  // 3. Spawn a clone of the car for the test drive.
  // 4. Make the original car not available for test drive.
};

const endTestDrive = async () => {
  // TODO:
  // 1. Despawn vehicle
  // 2. If player is not at the dealership, port him back :D
  // 3. Unlock the vehicle so it's available for a test drive again.
};

on(FiveMServerEvents.ResourceStart, async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    const root = GetResourcePath(GetCurrentResourceName());
    console.log('Started Used Car Dealer...loading vehicles');
    config = await ConfigController.loadConfig(`${root}/config.json`);

    config.spawnLocation.forEach(location => spawnPointsVehicleMap.set(location, ''));

    // Establish connection to database
    await Database.connect(config.database);

    // Create all the script's tables needed.
    await Database.createTables();

    // Load all vehicles that are currently for sale.
    const vehicles = await loadVehiclesForSale();
    setImmediate(() => {
      emitNet(FiveMUsedCarsServerEvents.VehiclesLoaded, vehicles);
    });

    // Save the current vehicles in map to retrieve them later.
    vehicles.forEach(vehicle => {
      if (!vehiclesForSale.has(vehicle.uuid)) {
        vehiclesForSale.set(vehicle.uuid, vehicle);
      }
    });
  }
});
