import { z } from "zod";

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

// Application messages

export const ConnectionStartMessageSchema = z.object({
  type: z.literal(MessageType.ConnectionStart),
  data: z.object({
    playerId: z.string(),
  }).strict(),
}).strict();

export const CreateRoomMessageSchema = z.object({
  type: z.literal(MessageType.CreateRoom),
  data: z.object({
    playerName: z.string(),
  }).strict(),
}).strict();

export const RoomCreatedMessageSchema = z.object({
  type: z.literal(MessageType.RoomCreated),
  data: z.object({
    roomId: z.string(),
    hostId: z.string(),
  }).strict(),
}).strict();

export const JoinRoomMessageSchema = z.object({
  type: z.literal(MessageType.JoinRoom),
  data: z.object({
    roomId: z.string(),
    playerName: z.string(),
  }).strict(),
}).strict();

export const GetStatusMessageSchema = z.object({
  type: z.literal(MessageType.GetStatus),
  data: z.object({}).strict(),
}).strict();

export const PlayerConnectedMessageSchema = z.object({
  type: z.literal(MessageType.PlayerConnected),
  data: z.object({
    playerId: z.string(),
    playerName: z.string(),
    roomId: z.string(),
  }).strict(),
}).strict();

export const JoinedRoomMessageSchema = z.object({
  type: z.literal(MessageType.JoinedRoom),
  data: z.object({
    roomId: z.string(),
  }).strict(),
}).strict();

export const ErrorMessageSchema = z.object({
  type: z.literal(MessageType.Error),
  data: z.object({
    message: z.string(),
  }).strict(),
}).strict();

// WebRTC signalling messages

export const OfferMessageSchema = z.object({
  type: z.literal(MessageType.Offer),
  peer: z.string(),
  orgPeer: z.string(),
  data: z.object({
    type: z.string(),
    sdp: z.string(),
  }),
  roomId: z.string(),
}).strict();

export const AnswerMessageSchema = z.object({
  type: z.literal(MessageType.Answer),
  peer: z.string(),
  orgPeer: z.string(),
  data: z.object({
    type: z.string(),
    sdp: z.string(),
  }),
  roomId: z.string(),
}).strict();

export const CandidateMessageSchema = z.object({
  type: z.literal(MessageType.Candidate),
  peer: z.string(),
  orgPeer: z.string(),
  mid: z.string().nullable(),
  index: z.number().int().nonnegative().nullable(),
  sdp: z.string(),
  roomId: z.string(),
}).strict();

// Combined schema
export const MessageSchema = z.discriminatedUnion("type", [
  ConnectionStartMessageSchema,
  CreateRoomMessageSchema,
  RoomCreatedMessageSchema,
  JoinRoomMessageSchema,
  GetStatusMessageSchema,
  PlayerConnectedMessageSchema,
  JoinedRoomMessageSchema,
  ErrorMessageSchema,
  OfferMessageSchema,
  AnswerMessageSchema,
  CandidateMessageSchema,
]);

// Inferred types

export type ConnectionStartMessage = z.infer<typeof ConnectionStartMessageSchema>;
export type CreateRoomMessage = z.infer<typeof CreateRoomMessageSchema>;
export type RoomCreatedMessage = z.infer<typeof RoomCreatedMessageSchema>;
export type JoinRoomMessage = z.infer<typeof JoinRoomMessageSchema>;
export type GetStatusMessage = z.infer<typeof GetStatusMessageSchema>;
export type PlayerConnectedMessage = z.infer<typeof PlayerConnectedMessageSchema>;
export type JoinedRoomMessage = z.infer<typeof JoinedRoomMessageSchema>;
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;

export type OfferMessage = z.infer<typeof OfferMessageSchema>;
export type AnswerMessage = z.infer<typeof AnswerMessageSchema>;
export type CandidateMessage = z.infer<typeof CandidateMessageSchema>;

export type SignallingMessage =
  | OfferMessage
  | AnswerMessage
  | CandidateMessage;

export type Message = z.infer<typeof MessageSchema>;