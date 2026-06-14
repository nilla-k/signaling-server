import { RawData } from "ws";
import { MessageType } from "../types/messages.js";
import { Either, left, right } from "../types/utils.js";
import { roomManager } from "../services/RoomManager.js";
import { Player } from "../services/models/Player.js";

export const handleMessage = (data: RawData, player: Player): Either<Error, string> => {
    try { 
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case MessageType.CreateRoom:
          return roomManager.createRoom(player)
        
        case MessageType.JoinRoom:
          const roomId = message.body?.id
          if (roomId) {
            return roomManager.joinRoom(roomId, player)
          } else {
            return left(Error("Room id missing from message body"))
          }
        
        case MessageType.GetStatus:
          return right(roomManager.getStatus(player)) 
        default:
          return left(Error("Received unknown or missing message type."))
      }
    } catch(e) {
      return left(Error(`${e}`))
    }
}