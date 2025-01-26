import { Calendar } from "./Calendar";
import { Player } from "./Player";

export interface Team{
    _id: string;
    name: string;
    coach: string;
    players: Player[];
    calendar: Calendar[];
    createdBy: string;
    inviteCode: string;
}