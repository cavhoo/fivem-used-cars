import {
  FiveMClientEvents,
  Client,
  Blip,
  UsedCarsServerEvents,
  UsedCarsClientEvents,
  Marker,
} from '../common';

const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/** Draw the blips that have been configured onto the map */
const showMapBlip = (blips: Blip[]) => {
  blips.forEach(blip => {
    const [x, y, z] = blip.location;
    const b = AddBlipForCoord(x, y, z);
    SetBlipDisplay(b, blip.display);
    SetBlipSprite(b, blip.type);
    SetBlipColour(b, blip.color);
    SetBlipScale(b, blip.scale);
    AddTextEntry(`cardealer_${blip.label.replace(' ', '_')}`, blip.label);
    BeginTextCommandSetBlipName(`cardealer_${blip.label.replace(' ', '_')}`);
    EndTextCommandSetBlipName(b);
  });
};

const drawMarkers = async (markers: Marker[]) => {
  while (true) {
    markers.forEach(marker => {
      const [posX, posY, posZ] = marker.position;
      const [rotX, rotY, rotZ] = marker.rotation;
      const [dirX, dirY, dirZ] = marker.direction;
      const [scaleX, scaleY, scaleZ] = marker.scale;
      const [red, green, blue, alpha] = marker.color;

      DrawMarker(
        marker.type,
        posX,
        posY,
        posZ,
        dirX,
        dirY,
        dirZ,
        rotX,
        rotY,
        rotZ,
        scaleX,
        scaleY,
        scaleZ,
        red,
        green,
        blue,
        alpha,
        false,
        false,
        2,
        false,
        null,
        null,
        false,
      );
    });

    await Delay(1);
  }
};

on(FiveMClientEvents.ClientResourceStart, (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    // Debug command.
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

    // After the config has been loaded.
    onNet(UsedCarsServerEvents.ClientConfigLoaded, (config: Client) => {
      showMapBlip(config.blips);
      //drawMarkers(config.markers);
    });

    // Load the config for the client side.
    setImmediate(() => emitNet(UsedCarsClientEvents.GetConfig));
  }
});
