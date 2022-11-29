declare module "chat" {
  import { Player } from "alt-server";
  export function send(player: Player, msg: string): void;
  export function broadcast(msg: string): void;
  export function registerCmd(
    cmd: string,
    callback: (player: Player, cmd: string, args: string[]) => void
  ): void;
  export function mutePlayer(player: Player, state: boolean): void;
}
