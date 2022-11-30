import { Query } from "./database/query";
import {ConfigController } from "./config/configController";
import {FiveMServerEvents } from "../common";
import { Vehicle } from "./models/vehicle";
import { Database } from "./database/database";

 const loadVehiclesForSale = async () => {
  const vehicles = await Query.Select<Vehicle>().from("vehicles_for_sale").execute();
  console.log("Loaded Vehicles: ", vehicles);
 }


on(FiveMServerEvents.ResourceStart, async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    const root = GetResourcePath(GetCurrentResourceName());
    console.log("Started Used Car Dealer...loading vehicles");
    const config = await ConfigController.loadConfig(`${root}/config.json`);


    await Database.connect(config.database);
    await loadVehiclesForSale();
  }
})
