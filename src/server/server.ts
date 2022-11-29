import {FiveMServerEvents } from "../common";


on(FiveMServerEvents.ResourceStart, (resource: string) => {
  if (resource === GetCurrentResourceName()) {
     
  }
})
