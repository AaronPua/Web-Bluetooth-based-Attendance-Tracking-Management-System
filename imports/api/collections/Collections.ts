import { Mongo } from "meteor/mongo";

export const UsersInCourse = new Mongo.Collection('usersInCourse');
export const UsersNotInCourse = new Mongo.Collection('usersNotInCourse');
export const Students = new Mongo.Collection('students');
export const Instructors = new Mongo.Collection('instructors');