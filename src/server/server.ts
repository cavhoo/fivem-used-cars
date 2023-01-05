import {
  Client,
  FiveMClientEvents,
  FiveMServerEvents,
  UsedCarsClientEvents,
  UsedCarsServerEvents,
  Vec3,
} from '../common';
import { ConfigController } from './config/configController';
import { IShowroomLocation, IUsedCarsConfig } from './config/configValidator';
import { Database, Tables } from './database/database';
import { Query } from './database/query';
import { Vehicle } from './models/vehicle';

/** The vehicles that are for sale */
const vehiclesForSale = new Map<string, Vehicle>();
const spawnPointsVehicleMap = new Map<IShowroomLocation, string>();
const spawnedVehicles: string[] = [];
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

    SetVehicleNumberPlateText(v, vehicle.plate);
    SetVehicleDoorsLocked(v, 1);

    spawnPointsVehicleMap.set(spawnLocation, vehicle.uuid);
    spawnedVehicles.push(vehicle.uuid);
  });

  setImmediate(() => {
    emitNet(UsedCarsServerEvents.VehiclesSpawned, -1, spawnedVehicles);
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
    console.log('Started FiveMUsedCarDealer');
    const root = GetResourcePath(GetCurrentResourceName());
    config = await ConfigController.loadConfig(`${root}/dist/config.json`);

    config.spawnLocation.forEach(location =>
      spawnPointsVehicleMap.set(
        {
          heading: location.heading,
          location: new Vec3(location.location.x, location.location.y, location.location.z),
        },
        '',
      ),
    );

    // Establish connection to database
    await Database.connect(config.database);

    // Create all the script's tables needed.
    await Database.createTables();

    // Load all vehicles that are currently for sale.
    const vehicles = await loadVehiclesForSale();
    // Save the current vehicles in map to retrieve them later.
    vehicles.forEach(vehicle => {
      if (!vehiclesForSale.has(vehicle.uuid)) {
        vehiclesForSale.set(vehicle.uuid, vehicle);
      }
    });
    const clientConfig: Client = {
      blips: config.blips,
      language: config.language,
      markers: config.markers,
      cars: [],
    };

    onNet(UsedCarsClientEvents.GetConfig, () => {
      console.log('Requesting Client config');
      const playerId = source;

      clientConfig.cars = spawnedVehicles.map(vehicle => {
        const vehicleData = vehiclesForSale.get(vehicle);

        return {
          price: vehicleData.price,
          name: vehicleData.make,
          position: [...spawnPointsVehicleMap.entries()]
            .find(([_, carUUID]) => carUUID === vehicleData.uuid)[0]
            .location.toArray(),
        };
      });

      setImmediate(() => {
        emitNet(UsedCarsServerEvents.ClientConfigLoaded, playerId, clientConfig);
      });
    });

    spawnVehicles();
  }
});
