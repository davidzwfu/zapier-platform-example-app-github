const sample = require('../samples/sample_signature');

const triggerIssue = (z, bundle) => {
  const responsePromise = z.request({
    method: 'GET',
    url: `https://api-wallet-qa.venly.io/api/signatures`,
    params: {
      status: 'SIGNED',
      page: 1,
      size: 30,
      sortOn: 'createdAt',
      sortOrder: 'DESC'
    }
  });
  return responsePromise
    .then(response => {
      const content = JSON.parse(response.content);
      const signatures = content.result.map(item => {
        item.id = item.signatureRequest.id;
        return item;
      })
      return signatures;
    });
};

module.exports = {
  key: 'signature',
  noun: 'Signature',

  display: {
    label: 'New Signature',
    description: 'Triggers on a new signature.'
  },

  operation: {
    inputFields: [
      // {key: 'repo', label:'Repo', required: true, dynamic: 'repo.full_name.full_name'},
      // {key:'filter', required: false, label: 'Filter', choices: {assigned:'assigned',created:'created',mentioned:'mentioned',subscribed:'subscribed',all:'all'}, helpText:'Default is "assigned"'},
      // {key:'state', required: false, label: 'State', choices: {open:'open',closed:'closed',all:'all'}, helpText:'Default is "open"'}
    ],
    perform: triggerIssue,

    sample: sample
  }
};
