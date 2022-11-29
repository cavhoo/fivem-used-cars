import { FiveMClientEvents } from "../common";

setImmediate(() => {
  emitNet('helloserver');
});

onNet('helloclient', message => {
  console.log(`The server replied: ${message}`);
});

on(FiveMClientEvents.ClientResourceStart, (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    console.log("Used car dealer started!");
  }
})
