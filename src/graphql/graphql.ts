
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateUserInput {
    name: string;
    email: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface IQuery {
    users(): User[] | Promise<User[]>;
}

export interface IMutation {
    createUser(input: CreateUserInput): User | Promise<User>;
}

export interface ISubscription {
    userCreated(): User | Promise<User>;
}

type Nullable<T> = T | null;
