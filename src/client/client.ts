import { FiveMClientEvents } from "../common";

on(FiveMClientEvents.ClientResourceStart, (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    console.log("Used car dealer started!");
  }
})
