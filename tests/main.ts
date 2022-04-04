import { Meteor } from 'meteor/meteor';
import assert from 'assert';
import '../imports/api/users/UsersMethods.test.ts';
import '../imports/api/courses/CoursesMethods.test.ts';
import '../imports/api/lessons/LessonsMethods.test.ts';
import '../imports/api/beacons/BeaconsMethods.test.ts';
import '../imports/api/users/server/UsersPublications.test.ts';
import '../imports/api/courses/server/CoursesPublications.test.ts';
import '../imports/api/lessons/server/LessonsPublications.test.ts';
import '../imports/api/beacons/server/BeaconsPublications.test.ts';

// describe('simple-todos-react', function () {
//   it('package.json has correct name', async function () {
//     const { name } = await import('../package.json');
//     assert.strictEqual(name, 'simple-todos-react');
//   });

//   if (Meteor.isClient) {
//     it('client is not server', function () {
//       assert.strictEqual(Meteor.isServer, false);
//     });
//   }

//   if (Meteor.isServer) {
//     it('server is not client', function () {
//       assert.strictEqual(Meteor.isClient, false);
//     });
//   }
// });
