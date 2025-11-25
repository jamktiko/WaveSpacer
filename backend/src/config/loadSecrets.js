const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

// load secrets from aws secrets manager
async function loadSecrets() {
  const client = new SecretsManagerClient({ region: 'eu-north-1' });
  const secretName = 'wavespacer-backend-secrets';

  try {
    // get secret values
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    if (response.SecretString) {
      const secrets = JSON.parse(response.SecretString);

      //loop through the values and put them on process.env
      for (const [key, value] of Object.entries(secrets)) {
        process.env[key] = value;
      }
    } else {
      console.error('No SecretString found in response');
    }
  } catch (err) {
    console.error('Failed to load secrets:', err);
  }
}

module.exports = { loadSecrets };
