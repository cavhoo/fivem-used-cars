import {
  FiveMClientEvents,
  Client,
  Blip,
  UsedCarsServerEvents,
  UsedCarsClientEvents,
  Marker,
} from '../common';
import { DrawText3D } from './utils/3dText';

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

/** Draw a single marker on the floor */
const drawMarker = (
  type: number,
  position: number[],
  rotation: number[],
  direction: number[],
  scale: number[],
  color: number[],
): void => {
  const [posX, posY, posZ] = position;
  const [rotX, rotY, rotZ] = rotation ?? [0, 0, 0];
  const [dirX, dirY, dirZ] = direction ?? [0, 0, 0];
  const [scaleX, scaleY, scaleZ] = scale ?? [1, 1, 1];
  const [red, green, blue, alpha] = color;

  DrawMarker(
    type,
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
    true,
    2,
    false,
    null,
    null,
    false,
  );
};

const drawMarkers = (markers: Marker[]) => {
  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    drawMarker(
      marker.type,
      marker.position,
      marker.rotation,
      marker.direction,
      marker.scale,
      marker.color,
    );
  }
};

const drawCarInfo = (cars: any[]) => {
  cars.forEach(car => {
    DrawText3D([car.x, car.y, car.z], car.name);
  });
};

/** Type alias for return of setTick function */
let markerTick: ReturnType<typeof setTick>;

on(FiveMClientEvents.ClientResourceStart, (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    // Debug command.
    RegisterCommand(
      'coords',
      (source, args, raw) => {
        const [x, y, z] = GetEntityCoords(PlayerPedId(), true);
        const r = GetEntityHeading(PlayerPedId());
        emit('chat:addMessage', {
          args: [`Your coords are: ${x} ${y} ${z} ${r}`],
        });
      },
      false,
    );

    RegisterCommand(
      'car',
      (source, args, raw) => {
        const [x, y, z] = GetEntityCoords(PlayerPedId(), true);
        CreateVehicle('banshee', x, y, z, 90.0, true, true);
      },
      false,
    );

    // After the config has been loaded.
    onNet(UsedCarsServerEvents.ClientConfigLoaded, (config: Client) => {
      showMapBlip(config.blips);
      markerTick = setTick(() => {
        drawMarkers(config.markers);
      });
    });

    // Load the config for the client side.
    emitNet(UsedCarsClientEvents.GetConfig);
  }
});
