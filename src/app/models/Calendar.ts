import { Matchday } from "./Matchday";

export interface Calendar{
    _id: string;
    matchdays: Matchday[];
    season: string;
}