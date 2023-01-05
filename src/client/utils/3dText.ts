export interface TextStyle {
  scale: [x: number, y: number];
  font: number;
  color: [r: number, g: number, b: number];
}

export const DrawText3D = ([x, y, z]: [x: number, y: number, z: number], text: string) => {
  const [onScreen, _x, _y] = World3dToScreen2d(x, y, z);
  const [px, py, pz] = GetGameplayCamCoords();

  if (onScreen) {
    SetTextScale(0.35, 0.35);
    SetTextFont(4);
    SetTextProportional(true);
    SetTextColour(255, 255, 255, 215);
    SetTextDropshadow(0, 0, 0, 0, 55);
    SetTextDropShadow();
    SetTextOutline();
    SetTextEntry('STRING');
    SetTextCentre(true);
    AddTextComponentString(text);
    DrawText(_x, _y);
  }
};
