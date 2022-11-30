import { Query } from "./database/query";
import {ConfigController } from "./config/configController";
import {FiveMServerEvents } from "../common";
import { Vehicle } from "./models/vehicle";
import { Database } from "./database/database";

 const loadVehiclesForSale = async () => {
  const vehicles = await Query.Select<Vehicle>().from("vehicles_for_sale").execute();
  console.log("Loaded Vehicles: ", vehicles);
 }


on(FiveMServerEvents.ResourceStart, (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    console.log("Started Used Car Dealer...loading vehicles");
    Database.connect({
      user: "comrp",
      password: "comrp",
      host: "localhost",
      database: "comrp",
    });
    void loadVehiclesForSale();
  }
})
