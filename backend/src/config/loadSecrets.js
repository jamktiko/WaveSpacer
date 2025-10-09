// config/loadSecrets.js
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

async function loadSecrets() {
  const region = 'eu-north-1';
  const secretName = 'wavespacer-backend-secrets';

  const client = new SecretsManagerClient({ region });

  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    if (!response || !response.SecretString) {
      throw new Error('No SecretString found in Secrets Manager response');
    }

    const secrets = JSON.parse(response.SecretString);

    // Asetetaan kaikki avain-arvot suoraan prosessin ympäristöön
    Object.assign(process.env, secrets);

    console.log('Secrets loaded successfully from AWS Secrets Manager');
  } catch (err) {
    console.error('Failed to load secrets from AWS Secrets Manager:', err);
    throw err; // pysäytetään käynnistys, jos salaisuuksia ei saada
  }
}

module.exports = { loadSecrets };
