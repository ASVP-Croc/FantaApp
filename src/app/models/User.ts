import { Team } from "./Team";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    teamsJoined: {team: Team; totalPoints: number}[];
  }