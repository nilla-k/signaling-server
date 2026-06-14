import { RawData } from "ws";
import { MessageType } from "../types/messages.js";
import { Either, left, right } from "../types/utils.js";

export const handleMessage = (data: RawData): Either<Error, string> => {
    try { 
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case MessageType.CreateRoom:
          return right("Received request to create room")
        case MessageType.JoinRoom:
          return right(`Received request to join room, details: ${message.body} `)
        default:
          return left(Error("Received unknown or missing message type."))
      }
    } catch(e) {
      return left(Error(`${e}`))
    }
}