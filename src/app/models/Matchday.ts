import { Formation } from "./Formation";

export interface Matchday{
    _id: string;
    number: number;
    date: Date;
    formation: Formation;
}