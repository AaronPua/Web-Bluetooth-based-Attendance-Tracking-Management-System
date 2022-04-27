import 'jsdom-global/register';

import '../imports/api/users/tests/UsersMethods.test.ts';
import '../imports/api/users/tests/UsersPublications.test.ts';

import '../imports/api/courses/tests/CoursesMethods.test.ts';
import '../imports/api/courses/tests/CoursesPublications.test.ts';

import '../imports/api/lessons/tests/LessonsMethods.test.ts';
import '../imports/api/lessons/tests/LessonsPublications.test.ts';

import '../imports/api/beacons/tests/BeaconsMethods.test.ts';
import '../imports/api/beacons/tests/BeaconsPublications.test.ts';

import '../imports/ui/tests/Login.spec';
import '../imports/ui/tests/UnknownRoute.spec';
import '../imports/ui/tests/Registration.spec';