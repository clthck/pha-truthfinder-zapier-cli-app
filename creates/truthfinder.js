const csrfLogin = require('../csrf-login');

// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'truthfinder',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Truthfinder',
  display: {
    label: 'Probe Truthfinder Data',
    description: 'Grabs truthfinder data (raw HTML) from truthfinder.com.'
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [
      {key: 'phoneNumber', required: true, type: 'string'}
    ],
    perform: (z, bundle) => {
      return csrfLogin({
          host: 'https://www.truthfinder.com',
          loginFormSelector: 'name="login"',
          loginUsernameField: 'email',
          loginPasswordField: 'password',
          tokenFieldName: 'csrf_token',
          loginPath: '/login',
          email: process.env.TRUTHFINDER_LOGIN_EMAIL,
          password: process.env.TRUTHFINDER_LOGIN_PASSWORD
        })
        .then(info => info.requestAsync(`/dashboard/report/phone/${bundle.inputData.phoneNumber}`, {}))
        .then(data => ({
          rawHtml: data
        }));
    }
  }
};
