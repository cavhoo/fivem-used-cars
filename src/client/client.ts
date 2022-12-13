import { FiveMClientEvents, FiveMUsedCarsServerEvents, FiveMUsedCarsClientEvents } from '../common';
const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));
on(FiveMClientEvents.ClientResourceStart, (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    console.log('Used car dealer started!');

    RegisterCommand(
      'coords',
      (source, args, raw) => {
        const [x, y, z] = GetEntityCoords(PlayerPedId(), true);

        emit('chat:addMessage', {
          args: [`Your coords are: ${x} ${y} ${z}`],
        });
      },
      false,
    );

    onNet(FiveMUsedCarsServerEvents.VehiclesLoaded, async (vehicles: any) => {
      // Request the model and wait until the game has loaded it
      console.log(...vehicles);

      [...vehicles].forEach(async vehicle => {
        const hash = GetHashKey((vehicle as any).model);
        console.log(`Requesting Model: ${(vehicle as any).model}`);
        RequestModel(hash);
        while (!HasModelLoaded(hash)) {
          await Delay(500);
        }

        CreateVehicle(hash, -1674.5, -875.8, 9.0, 90.0, true, false);
      });
    });

    setImmediate(() => emitNet(FiveMUsedCarsClientEvents.LoadVehicles));
  }
});
