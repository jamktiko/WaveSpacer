const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

async function loadSecrets() {
  const client = new SecretsManagerClient({
    region: 'eu-north-1',
  });

  const secretName = 'wavespacer-backend-secrets';

  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    if ('SecretString' in response) {
      const secrets = JSON.parse(response.SecretString);

      // Aseta ympäristömuuttujiksi
      for (const [key, value] of Object.entries(secrets)) {
        process.env[key] = value;
      }

      console.log('Secrets loaded successfully from AWS Secrets Manager');
    } else {
      console.error('No SecretString found in response');
    }
  } catch (err) {
    console.error('Failed to load secrets:', err);
  }
}

module.exports = { loadSecrets };
