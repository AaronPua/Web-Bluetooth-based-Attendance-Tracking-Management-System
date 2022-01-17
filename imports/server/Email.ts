import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';

Accounts.config({
    sendVerificationEmail: true,
    
});

// process.env.MAIL_URL = "smtp://aaronpua@hotmail.com:7760ED9633C521FCF59D1B8D0AE1078F9E54@smtp.elasticemail.com:2525";
process.env.MAIL_URL = "smtp://project.1:secret.1@localhost:1025";

// Accounts.urls.verifyEmail = (token: string) => {
//    return Meteor.absoluteUrl(`verify-email/${token}`);
// }

Accounts.emailTemplates.siteName = 'COMP8047 BCIT Project';
Accounts.emailTemplates.from = 'comp8047@project.ca';

// Accounts.emailTemplates.resetPassword.from = () => {
//   // Overrides the value set in `Accounts.emailTemplates.from` when resetting
//   // passwords.
//   return 'AwesomeSite Password Reset <no-reply@example.com>';
// };

Accounts.emailTemplates.verifyEmail = {
   subject(user) {
      return `[${user.profile.firstName}] Verify Your Email Address`;
   },
   text(user, url) {
      let emailAddress = user.emails[0].address,
          urlWithoutHash = url.replace('#/', ''),
          supportEmail = "comp8047-support@project.ca",
          emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

         return emailBody;
   }
};