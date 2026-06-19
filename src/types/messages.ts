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

export type Message = {
	type: MessageType
	data: object
}
