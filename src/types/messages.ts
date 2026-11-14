/**
 * These values must align with the same number and order of values
 * defined in the Godot client.
 *
 * Because of the numbers, you see. Pesky numbers.
 */
export enum MessageType {
	ConnectionStart = 0,
	CreateRoom = 1,
	RoomCreated = 2,
	JoinRoom = 3,
	GetStatus = 4, // Can probs delete
	PlayerConnected = 5,
	JoinedRoom = 6,
	Offer = 7,
	Answer = 8,
	Candidate = 9,
	Error = 10,
}

export interface Message {
	type: MessageType
	data: object
}

export interface ConnectionStartMessage extends Message {
	type: MessageType.ConnectionStart,
	data: {
		playerId: string, // TODO: Key changed, need to update client
	}
}

export interface CreateRoomMessage extends Message {
	type: MessageType.CreateRoom,
	data: {
		playerName: string, // TODO: Key changed, need to update client
	}
}

export interface RoomCreatedMessage extends Message {
	type: MessageType.RoomCreated,
	data: {
		roomId: string,
		hostId: string
	}
}

export interface JoinRoomMessage extends Message {
	type: MessageType.JoinRoom
	data: {
		roomId: string,
		playerName: string, // TODO: Key changed, need to update client
	}
}

export interface PlayerConnectedMessage extends Message {
	type: MessageType.PlayerConnected,
	data: {
		playerId: string,
		playerName: string,
		roomId: string // TODO: Key changed, need to update client
	}
}

export interface JoinedRoomMessage extends Message {
	type: MessageType.JoinedRoom,
	data: {
		roomId: string // TODO: Key changed, need to update client
	}
}

export interface ErrorMessage extends Message {
	type: MessageType.Error,
	data: {
		message: string
	}
}
