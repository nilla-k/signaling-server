export enum MessageType {
  CreateRoom = "create_room",
  JoinRoom = "join_room"
}

export interface Message {
  type: MessageType,
  body: string
}