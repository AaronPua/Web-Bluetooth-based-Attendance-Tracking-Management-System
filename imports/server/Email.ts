import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';

Accounts.config({
    sendVerificationEmail: true,
    
});

// process.env.MAIL_URL = "smtp://aaronpua@hotmail.com:7760ED9633C521FCF59D1B8D0AE1078F9E54@smtp.elasticemail.com:2525";
process.env.MAIL_URL = "smtp://project.1:secret.1@localhost:1025";

Accounts.urls.verifyEmail = (token: string) => {
   return Meteor.absoluteUrl(`verify-email/${token}`);
}

Accounts.urls.resetPassword = (token: string) => {
   return Meteor.absoluteUrl(`reset-password/${token}`);
};

Accounts.emailTemplates.siteName = 'COMP8047 BCIT Project';
Accounts.emailTemplates.from = 'comp8047@project.ca';

Accounts.emailTemplates.verifyEmail = {
   subject(user) {
      return `[${user.profile.firstName}] Verify Your Email Address`;
   },
   text(user, url) {
      let emailBody = `To verify your email address, visit the following link:\n\n${url}\n\n If you did not request this verification, please ignore this email.`;

      return emailBody;
   }
};

Accounts.emailTemplates.resetPassword = {
   subject(user) {
      return `[${user.profile.firstName}] Reset Your Password`;
   },
   text(user, url) {
      let emailBody = `To reset your password, visit the following link:\n\n${url}\n\n If you did not request this password reset, please ignore this email.`;

      return emailBody;
   }
};