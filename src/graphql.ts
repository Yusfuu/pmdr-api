
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum UserStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    AWAY = "AWAY"
}

export class CreateEventInput {
    title: string;
    description?: Nullable<string>;
    scheduledAt: string;
    startNow?: Nullable<boolean>;
    pushReminder?: Nullable<boolean>;
}

export class CreateUserInput {
    username: string;
    avatar?: Nullable<string>;
    password?: Nullable<string>;
}

export class Event {
    id: string;
    title: string;
    description?: Nullable<string>;
    coverImageUrl?: Nullable<string>;
    scheduledAt: string;
    startNow: boolean;
    pushReminder: boolean;
    createdAt: string;
    updatedAt: string;
    host: User;
}

export abstract class IQuery {
    abstract event(id: string): Nullable<Event> | Promise<Nullable<Event>>;

    abstract events(): Event[] | Promise<Event[]>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;

    abstract users(keyword: string): Nullable<User>[] | Promise<Nullable<User>[]>;
}

export abstract class IMutation {
    abstract createEvent(data: CreateEventInput): Event | Promise<Event>;

    abstract removeEvent(id: string): Nullable<Event> | Promise<Nullable<Event>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract removeUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class User {
    id: string;
    username: string;
    avatar?: Nullable<string>;
    status: UserStatus;
    events: Event[];
}

type Nullable<T> = T | null;
