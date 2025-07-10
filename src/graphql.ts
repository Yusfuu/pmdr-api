
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateUserInput {
    email: string;
    name: string;
}

export interface IMutation {
    createUser(input: CreateUserInput): User | Promise<User>;
}

export interface IQuery {
    users(): User[] | Promise<User[]>;
}

export interface User {
    email: string;
    id: string;
    name: string;
}

type Nullable<T> = T | null;
