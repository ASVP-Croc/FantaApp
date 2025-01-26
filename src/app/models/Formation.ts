import { Player } from "./Player";

export interface Formation{
    _id: string;
    players: Player[];
    module: string;
}