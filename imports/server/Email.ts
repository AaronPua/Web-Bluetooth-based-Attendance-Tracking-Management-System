import { Accounts } from 'meteor/accounts-base'

process.env.MAIL_URL = "smtp://aaronpua@hotmail.com:7760ED9633C521FCF59D1B8D0AE1078F9E54@smtp.elasticemail.com:2525";

Accounts.emailTemplates.siteName = 'COMP8047 BCIT Project';
Accounts.emailTemplates.from = 'aaronpua@hotmail.com';

// Accounts.emailTemplates.resetPassword.from = () => {
//   // Overrides the value set in `Accounts.emailTemplates.from` when resetting
//   // passwords.
//   return 'AwesomeSite Password Reset <no-reply@example.com>';
// };

Accounts.emailTemplates.verifyEmail = {
   subject() {
      return "Activate your account now!";
   },
   text(user, url) {
      return `Hey ${user.profile.firstName}! Verify your e-mail by following this link: ${url}`;
   }
};