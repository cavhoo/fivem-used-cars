import { Query } from "./database/query";
import {ConfigController } from "./config/configController";
import {FiveMServerEvents } from "../common";
import { Vehicle } from "./models/vehicle";

 const loadVehiclesForSale = async () => {
  const vehicles = await Query.Select<Vehicle>().execute();
  console.log(vehicles);
 }


on(FiveMServerEvents.ResourceStart, async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    await loadVehiclesForSale();
  }
})
