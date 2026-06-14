import { Player } from "./Player.ts"

export class Room {
    readonly id: string = Math.random().toString(36).substring(2,8).toUpperCase()
    players: Player[] = []
}