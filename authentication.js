const getSessionKey = async (z, bundle) => {
  const response = await z.request({
    url: 'https://login-qa.venly.io/auth/realms/Arkane/protocol/openid-connect/token',
    method: 'POST',
    body: {
      client_id: bundle.authData.clientId,
      client_secret: bundle.authData.clientSecret,
      grant_type: 'client_credentials',
      // code: bundle.inputData.code,

      // Extra data can be pulled from the querystring. For instance:
      // 'accountDomain': bundle.cleanedRequest.querystring.accountDomain
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // If you're using core v9.x or older, you should call response.throwForStatus()
  // or verify response.status === 200 before you continue.

  // This function should return `access_token`.
  // If your app does an app refresh, then `refresh_token` should be returned here
  // as well
  z.console.log(response);
  return {
    sessionKey: response.data.access_token,
  };
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.sessionKey) {
    request.headers.Authorization = `Bearer ${bundle.authData.sessionKey}`;
  }

  return request;
};

// You want to make a request to an endpoint that is either specifically designed
// to test auth, or one that every user will have access to. eg: `/me`.
// By returning the entire request object, you have access to the request and
// response data for testing purposes. Your connection label can access any data
// from the returned response using the `json.` prefix. eg: `{{json.username}}`.
const test = (z, bundle) => z.request({ url: 'https://api.github.com/user' });

const authentication = {
  type: 'session',
  // "test" could also be a function
  test: {
    url: 'https://api-wallet-qa.venly.io/api/signables',
  },
  fields: [
    {
      key: 'clientId',
      type: 'string',
      required: true,
      helpText: 'Your Client ID.',
    },
    {
      key: 'clientSecret',
      type: 'string',
      required: true,
      helpText: 'Your Client Secret.',
    },
    // For Session Auth we store `sessionKey` automatically in `bundle.authData`
    // for future use. If you need to save/use something that the user shouldn't
    // need to type/choose, add a "computed" field, like:
    // {key: 'something': type: 'string', required: false, computed: true}
    // And remember to return it in sessionConfig.perform
  ],
  sessionConfig: {
    perform: getSessionKey,
  },
};

module.exports = {
  authentication,
  befores: [includeBearerToken],
  afters: [],
};
