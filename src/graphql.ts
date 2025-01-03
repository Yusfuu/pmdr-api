
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum RoomAction {
    JOINED = "JOINED",
    LEFT = "LEFT"
}

export enum UserStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    AWAY = "AWAY"
}

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

export interface LoginInput {
    username: string;
    password: string;
}

export interface SignalDataInput {
    from: string;
    to: string;
    type: string;
    payload: string;
}

export interface CreateRoomInput {
    name: string;
    hostId: string;
}

export interface JoinRoomInput {
    roomId: string;
    userId: string;
}

export interface LeaveRoomInput {
    roomId: string;
    userId: string;
}

export interface CreateUserInput {
    username: string;
    avatar?: Nullable<string>;
    password?: Nullable<string>;
}

export interface SignOutResponse {
    message?: Nullable<string>;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface IMutation {
    signIn(loginInput: LoginInput): AuthResponse | Promise<AuthResponse>;
    register(registerInput: RegisterInput): AuthResponse | Promise<AuthResponse>;
    refreshToken(): AuthResponse | Promise<AuthResponse>;
    signOut(): Nullable<SignOutResponse> | Promise<Nullable<SignOutResponse>>;
    createRoom(createRoomInput: CreateRoomInput): Room | Promise<Room>;
    joinRoom(joinRoomInput: JoinRoomInput): Room | Promise<Room>;
    leaveRoom(leaveRoomInput: LeaveRoomInput): Room | Promise<Room>;
    removeRoom(id: string): Nullable<Room> | Promise<Nullable<Room>>;
    sendSignal(roomId: string, signal: SignalDataInput): boolean | Promise<boolean>;
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    removeUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface Room {
    id: string;
    name: string;
    host: User;
    participants: Nullable<User>[];
}

export interface SignalData {
    from: string;
    to: string;
    type: string;
    payload: string;
}

export interface RoomUpdatePayload {
    room: Room;
}

export interface RoomActivity {
    roomId: string;
    user: User;
    action: RoomAction;
    timestamp: string;
}

export interface IQuery {
    rooms(): Nullable<Room>[] | Promise<Nullable<Room>[]>;
    room(id: string): Nullable<Room> | Promise<Nullable<Room>>;
    hostedRoomsByUserId(userId: string): Nullable<Room>[] | Promise<Nullable<Room>[]>;
    users(): Nullable<User>[] | Promise<Nullable<User>[]>;
    user(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export interface ISubscription {
    roomUpdated(roomId: string): RoomUpdatePayload | Promise<RoomUpdatePayload>;
    signalReceived(roomId: string): SignalData | Promise<SignalData>;
}

export interface User {
    id: string;
    username: string;
    avatar?: Nullable<string>;
    status: UserStatus;
}

type Nullable<T> = T | null;
