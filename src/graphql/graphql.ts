
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
    password: string;
}

export interface Tokens {
    access_token?: Nullable<string>;
    refresh_token?: Nullable<string>;
}

export interface IMutation {
    signIn(email: string, password: string): Tokens | Promise<Tokens>;
    refreshToken(refresh_token: string): Tokens | Promise<Tokens>;
    createUser(input: CreateUserInput): User | Promise<User>;
}

export interface IQuery {
    me(): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface ISubscription {
    userCreated(): User | Promise<User>;
}

type Nullable<T> = T | null;
