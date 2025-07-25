
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum RoomRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export interface Tokens {
    access_token?: Nullable<string>;
    refresh_token?: Nullable<string>;
}

export interface IMutation {
    signIn(email: string, password: string, deviceId: string): Tokens | Promise<Tokens>;
    signOut(refresh_token: string, deviceId: string): boolean | Promise<boolean>;
    refreshToken(refresh_token: string, deviceId: string): Tokens | Promise<Tokens>;
    createRoom(name: string): Room | Promise<Room>;
    deleteRoom(id: string): boolean | Promise<boolean>;
    inviteToRoom(roomId: string, userId: string, role?: Nullable<RoomRole>): RoomMember | Promise<RoomMember>;
    leaveRoom(roomId: string): boolean | Promise<boolean>;
    kickFromRoom(roomId: string, userId: string): boolean | Promise<boolean>;
    updateRoomMemberRole(roomId: string, userId: string, role: RoomRole): RoomMember | Promise<RoomMember>;
    createUser(input: CreateUserInput): User | Promise<User>;
}

export interface IQuery {
    me(): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface Room {
    id: string;
    name: string;
    owner: User;
    members: RoomMember[];
    createdAt: string;
    updatedAt: string;
}

export interface RoomMember {
    id: string;
    user: User;
    room: Room;
    role: RoomRole;
    joinedAt: string;
}

export interface ISubscription {
    roomCreated(): Room | Promise<Room>;
    roomDeleted(): string | Promise<string>;
    userInvited(roomId: string): RoomMember | Promise<RoomMember>;
    userCreated(): User | Promise<User>;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

type Nullable<T> = T | null;
