import { Query } from './database/query';
import { ConfigController } from './config/configController';
import {
  FiveMServerEvents,
  FiveMUsedCarsServerEvents,
  FiveMUsedCarsClientEvents,
  Delay,
} from '../common';
import { Vehicle } from './models/vehicle';
import { Database, Tables } from './database/database';
import { IUsedCarsConfig, IShowroomLocation } from './config/configValidator';

const vehiclesForSale = new Map<string, Vehicle>();
const spawnPointsVehicleMap = new Map<IShowroomLocation, string>();
let config: IUsedCarsConfig;
let vehiclesSpawned: boolean = false;

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
const spawnVehicles = () => {
  // TODO:
  // 1. Loop through loaded vehicles
  [...vehiclesForSale.entries()].forEach(async ([_uuid, vehicle]) => {
    // 2. Take one spawn position of the given locations.
    const [spawnLocation, _] = getFreeSpawnPoint();

    // Obtain spawnable hash.
    const { location, heading } = spawnLocation;

    // Create the vehicle.
    // 3. Spawn one vehicle per spot.
    const v = CreateVehicleServerSetter(
      vehicle.model,
      'automobile',
      location.x,
      location.y,
      location.z,
      heading,
    );

    // EnsureEntityStateBag(v);
    // while (NetworkGetEntityOwner(v) == -1) {
    //   console.log('No net owner.');
    //   await Delay(5000);
    // }

    console.log(GetEntityCoords(v), v);
  });
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
    console.log(vehicles.length);
    // Save the current vehicles in map to retrieve them later.
    vehicles.forEach(vehicle => {
      if (!vehiclesForSale.has(vehicle.uuid)) {
        console.log(`Storting Vehicle: ${vehicle.model}`);
        vehiclesForSale.set(vehicle.uuid, vehicle);
      }
    });

    spawnVehicles();

    RegisterCommand(
      'car',
      async () => {
        //Citizen.invokeNative('CREATE_AUTOMOBILE', 'banshee', -1674.5, -875.8, 9.0, 90.0);

        const vehicle = CreateVehicleServerSetter(
          'banshee',
          'automobile',
          -1674.5,
          -875.8,
          9.0,
          90.0,
        );

        while (!DoesEntityExist(vehicle)) {
          await Delay(1);
        }
        // EnsureEntityStateBag(vehicle);
        // while (NetworkGetEntityOwner(vehicle) === -1) {
        //   console.log('No owner');
        //   await Delay(5000);
        // }
      },
      false,
    );

    onNet(FiveMUsedCarsClientEvents.LoadVehicles, source => {
      if (!vehiclesSpawned) {
        setImmediate(() => {
          emitNet(FiveMUsedCarsServerEvents.VehiclesLoaded, source, vehicles);
        });
      }
    });
  }
});
