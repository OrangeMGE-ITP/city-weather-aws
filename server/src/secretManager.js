const { SecretsManager } = require('aws-sdk');

exports.getSecret = async (secretName, region) => {
    const config = { region: region }
    let secretsManager = new SecretsManager(config);

    try {
        let secretValue = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

        if (secretValue.SecretString) {
            return (JSON.parse(secretValue.SecretString).apiKey);
        } else {
            let buff = new Buffer(secretValue.SecretBinary, 'base64');
            return (buff.toString('ascii'));
        }

    } catch (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
}