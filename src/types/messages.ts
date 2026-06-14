export enum MessageType {
  CreateRoom = "create_room",
  JoinRoom = "join_room",
  GetStatus = "get_status",
}

export type Message = {
  type: MessageType,
  body: string
}

export type JoinRoomMessageBody = {
    roomId: string
}