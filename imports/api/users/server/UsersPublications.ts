import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';

// Publish the role assignment collection as required by alanning:roles package
Meteor.publish(null, function () {
    if(Roles.userIsInRole(this.userId, 'admin')) {
        return Meteor.roleAssignment.find();
    }
    else if (this.userId) {
        return Meteor.roleAssignment.find({ 'user._id': this.userId });
    } 
    else {
        this.ready();
    }
});

// Publish the roles collection for admins, otherwise setUserRoles will not work.
Meteor.publish(null, function () {
    if(Roles.userIsInRole(this.userId, 'admin')) {
        return Meteor.roles.find();
    }
    else {
        this.ready();
    }
});

Meteor.publish('users.all', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    return Meteor.users.find();
});

Meteor.publish('users.specific', function(userId) {
    this.enableScope();
    check(userId, String);

    return Meteor.users.find({ _id: userId });
});

Meteor.publish('users.admins', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    const admins = Meteor.roleAssignment.find({ "role._id": 'admin' }).fetch();
    const adminIds = _.pluck(_.flatten(_.pluck(admins, 'user')), '_id');

    // return Meteor.users.find({ _id: { $in: adminIds }});

    ReactiveAggregate(this, Meteor.users, [
        {
            $match: { 
                _id: { $in: adminIds },
            }
        },
        {
            $lookup: {
                from: 'role-assignment',
                localField: '_id',
                foreignField: 'user._id',
                as: 'role'
            }
        },
        {
            $project: {
                emails: 1,
                profile: 1,
                courses: 1,
                "role.role._id": 1,
            }
        }
    ]);
});

Meteor.publish('users.instructors', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    const instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' }).fetch();
    const instructorIds = _.pluck(_.flatten(_.pluck(instructors, 'user')), '_id');

    // return Meteor.users.find({ _id: { $in: instructorIds }});

    ReactiveAggregate(this, Meteor.users, [
        {
            $match: { 
                _id: { $in: instructorIds },
            }
        },
        {
            $lookup: {
                from: 'role-assignment',
                localField: '_id',
                foreignField: 'user._id',
                as: 'role'
            }
        },
        {
            $project: {
                emails: 1,
                profile: 1,
                courses: 1,
                "role.role._id": 1,
            }
        }
    ]);
});

Meteor.publish('users.students', function() {
    this.enableScope();

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }
    
    const students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
    const studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');

    // return Meteor.users.find({ _id: { $in: studentIds }});

    ReactiveAggregate(this, Meteor.users, [
        {
            $match: { 
                _id: { $in: studentIds },
            }
        },
        {
            $lookup: {
                from: 'role-assignment',
                localField: '_id',
                foreignField: 'user._id',
                as: 'role'
            }
        },
        {
            $project: {
                emails: 1,
                profile: 1,
                courses: 1,
                "role.role._id": 1,
            }
        }
    ]);
});

Meteor.publish('users.students.inSpecificCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    if(!Roles.userIsInRole(this.userId, ['admin', 'instructor'])) {
        this.ready();
        return;
    }

    const students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
    const studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');

    // return Meteor.users.find({
    //     _id: { $in: studentIds },
    //     "courses._id": { $eq: courseId }
    // });

    ReactiveAggregate(this, Meteor.users, [
        {
            $match: { 
                _id: { $in: studentIds }, 
                "courses._id": { $eq: courseId } 
            }
        },
        {
            $lookup: {
                from: 'role-assignment',
                localField: '_id',
                foreignField: 'user._id',
                as: 'role'
            }
        },
        {
            $project: {
                emails: 1,
                profile: 1,
                courses: 1,
                "role.role._id": 1,
            }
        }
    ]);
});

Meteor.publish('users.students.notInSpecificCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    if(!Roles.userIsInRole(this.userId, ['admin', 'instructor'])) {
        this.ready();
        return;
    }

    const students = Meteor.roleAssignment.find({ "role._id": 'student' }).fetch();
    const studentIds = _.pluck(_.flatten(_.pluck(students, 'user')), '_id');

    // return Meteor.users.find({
    //     _id: { $in: studentIds },
    //     "courses._id": { $ne: courseId }
    // });

    ReactiveAggregate(this, Meteor.users, [
        {
            $match: { 
                _id: { $in: studentIds }, 
                "courses._id": { $ne: courseId } 
            }
        },
        {
            $lookup: {
                from: 'role-assignment',
                localField: '_id',
                foreignField: 'user._id',
                as: 'role'
            }
        },
        {
            $project: {
                emails: 1,
                profile: 1,
                courses: 1,
                "role.role._id": 1,
            }
        }
    ]);
});

Meteor.publish('users.instructors.inSpecificCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    if(!Roles.userIsInRole(this.userId, ['admin', 'instructor'])) {
        this.ready();
        return;
    }

    const instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' }).fetch();
    const instructorIds = _.pluck(_.flatten(_.pluck(instructors, 'user')), '_id');

    // return Meteor.users.find({
    //     _id: { $in: instructorIds },
    //     "courses._id": { $eq: courseId }
    // });

    ReactiveAggregate(this, Meteor.users, [
        {
            $match: { 
                _id: { $in: instructorIds }, 
                "courses._id": { $eq: courseId } 
            }
        },
        {
            $lookup: {
                from: 'role-assignment',
                localField: '_id',
                foreignField: 'user._id',
                as: 'role'
            }
        },
        {
            $project: {
                emails: 1,
                profile: 1,
                courses: 1,
                "role.role._id": 1,
            }
        }
    ]);
});

Meteor.publish('users.instructors.notInSpecificCourse', function(courseId) {
    this.enableScope();
    check(courseId, String);

    if(!Roles.userIsInRole(this.userId, 'admin')) {
        this.ready();
        return;
    }

    const instructors = Meteor.roleAssignment.find({ "role._id": 'instructor' }).fetch();
    const instructorIds = _.pluck(_.flatten(_.pluck(instructors, 'user')), '_id');

    // return Meteor.users.find({
    //     _id: { $in: instructorIds },
    //     "courses._id": { $ne: courseId }
    // });

    ReactiveAggregate(this, Meteor.users, [
        {
            $match: { 
                _id: { $in: instructorIds }, 
                "courses._id": { $ne: courseId } 
            }
        },
        {
            $lookup: {
                from: 'role-assignment',
                localField: '_id',
                foreignField: 'user._id',
                as: 'role'
            }
        },
        {
            $project: {
                emails: 1,
                profile: 1,
                courses: 1,
                "role.role._id": 1,
            }
        }
    ]);
});