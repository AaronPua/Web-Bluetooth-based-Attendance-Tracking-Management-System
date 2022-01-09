import SimpleSchema from 'simpl-schema';

SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      emailRequired: "Email is required.",
      emailInvalid: "Email must be a valid email address.",

      passwordRequired: "Password is required.",
      passwordInvalid: "Password is invalid.",
    }
  }
});