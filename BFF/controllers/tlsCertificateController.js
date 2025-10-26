const { proxyRequest } = require('../utils/proxy');
const crypto = require('crypto');

// Get TLS certificates list
exports.getTlsCertificates = async (req, res) => {
  try {
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/tls-certificates',
      'GET',
      forwardHeaders,
      '',
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to get TLS certificates list:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Add TLS certificate
exports.addTlsCertificate = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      '/v1/tls-certificates',
      'POST',
      forwardHeaders,
      body,
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to add TLS certificate:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Delete TLS certificate
exports.deleteTlsCertificate = async (req, res) => {
  try {
    // 获取对应证书的name
    const { name } = req.params;
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/tls-certificates/${name}`,
      'DELETE',
      forwardHeaders,
      '',
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to delete TLS certificate:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Update TLS certificate
exports.updateTlsCertificate = async (req, res) => {
  try {
    // 获取对应证书的name
    const { name } = req.params;
    const body = JSON.stringify(req.body);
    const { headers } = req;
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '',
    };

    const result = await proxyRequest(
      `/v1/tls-certificates/${name}`,
      'PUT',
      forwardHeaders,
      body,
    );

    // Directly return the data returned by the backend without any processing (including response headers and data)
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] Failed to update TLS certificate:', err);
    res.status(502).json({ code: 502, msg: 'Backend service unavailable' });
  }
};

// Validate certificate function
const validateCertificate = (cert, key) => {
  const errors = [];
  const warnings = [];
  const info = [];

  try {
    // ========== Basic validation ==========
    // 1. Validate certificate format validity
    if (!cert || typeof cert !== 'string') {
      errors.push('Certificate content cannot be empty, please check if the certificate data has been correctly input');
      return { valid: false, errors, warnings, info };
    }

    // Check PEM format
    if (!cert.includes('-----BEGIN CERTIFICATE-----') || !cert.includes('-----END CERTIFICATE-----')) {
      errors.push('Certificate format is incorrect, please ensure that the standard PEM format is used (starting with -----BEGIN CERTIFICATE----- and ending with -----END CERTIFICATE-----');
      return { valid: false, errors, warnings, info };
    }

    // 2. Validate private key format validity
    if (!key || typeof key !== 'string') {
      errors.push('私钥内容不能为空，请检查私钥数据是否已正确输入');
      return { valid: false, errors, warnings, info };
    }

    if (!key.includes('-----BEGIN') || !key.includes('-----END')) {
      errors.push('私钥格式不正确，请确保使用标准的PEM格式（以-----BEGIN开头，以-----END结尾）');
      return { valid: false, errors, warnings, info };
    }

    // 3. Parse certificate and private key, validate key completeness
    let certificate;
    let privateKey;
    let x509Cert;

    try {
      certificate = crypto.createPublicKey(cert);
      x509Cert = new crypto.X509Certificate(cert);
      info.push('Certificate format validation passed');
    } catch (err) {
      errors.push(`Certificate parsing failed: ${err.message}, please check if the certificate content is complete and formatted correctly`);
      return { valid: false, errors, warnings, info };
    }

    try {
      privateKey = crypto.createPrivateKey(key);
      info.push('Private key format validation passed');
    } catch (err) {
      errors.push(`Private key parsing failed: ${err.message}, please check if the private key content is complete and formatted correctly`);
      return { valid: false, errors, warnings, info };
    }

    // 4. Validate algorithm type and key length
    try {
      const keyType = privateKey.asymmetricKeyType;
      const keyDetails = privateKey.asymmetricKeyDetails;
      switch (keyType) {
        case 'rsa':
          info.push('Algorithm type: RSA');
          if (keyDetails && keyDetails.modulusLength) {
            info.push(`RSA key length: ${keyDetails.modulusLength} bits`);
            if (keyDetails.modulusLength < 2048) {
              warnings.push('RSA key length is less than 2048 bits, it is recommended to use a longer key to ensure security');
            }
          }
          break;
        case 'ec':
          info.push('Algorithm type: Elliptic Curve (EC)');
          if (keyDetails && keyDetails.namedCurve) {
            info.push(`Elliptic curve: ${keyDetails.namedCurve}`);
            // Check curve security
            const secureCurves = ['P-256', 'P-384', 'P-521', 'secp256r1', 'secp384r1', 'secp521r1'];
            if (!secureCurves.includes(keyDetails.namedCurve)) {
              warnings.push(`Elliptic curve ${keyDetails.namedCurve} may not be secure enough, it is recommended to use P-256, P-384 or P-521`);
            }
          }
          break;
        case 'ed25519':
          info.push('Algorithm type: Ed25519');
          info.push('Ed25519 key length: 256 bits');
          break;
        case 'ed448':
          info.push('Algorithm type: Ed448');
          info.push('Ed448 key length: 448 bits');
          break;
        case 'dsa':
          info.push('Algorithm type: DSA');
          warnings.push('DSA algorithm is deprecated, it is recommended to use RSA or elliptic curve algorithm');
          break;
        default:
          warnings.push(`Unknown key type: ${keyType}`);
      }
    } catch (err) {
      warnings.push(`Failed to get key details: ${err.message}`);
    }

    // ========== Advanced validation ==========

    // 5. Certificate chain integrity verification
    try {
      const certsPEM = cert.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g);
      if (!certsPEM || certsPEM.length === 0) {
        errors.push('No valid certificate data found');
        return { valid: false, errors, warnings, info };
      }

      info.push(`Certificate chain contains ${certsPEM.length} certificates`);

      // Validate the format of each certificate
      for (let i = 0; i < certsPEM.length; i++) {
        try {
          crypto.createPublicKey(certsPEM[i]);
        } catch (err) {
          errors.push(`Certificate chain error: the ${i + 1}th certificate format is incorrect: ${err.message}`);
          return { valid: false, errors, warnings, info };
        }
      }

      // Check certificate chain integrity requirements: at least 2 certificates (Leaf + Intermediate)
      if (certsPEM.length < 2) {
        errors.push(`Certificate chain is incomplete: at least 2 certificates (Leaf + Intermediate) are required, currently only ${certsPEM.length} certificates`);
        return { valid: false, errors, warnings, info };
      }

      // Convert to Node.js X509Certificate object
      const certs = certsPEM.map(pem => new crypto.X509Certificate(pem));

      let chainOk = true;
      const chainInfo = [];

      // Display certificate chain information
      for (let i = 0; i < certs.length; i++) {
        chainInfo.push(`Certificate ${i + 1}: subject=${certs[i].subject}, issuer=${certs[i].issuer}`);
      }

      // Check if Leaf is a self-signed certificate
      const leaf = certs[0];
      if (leaf.subject === leaf.issuer) {
        errors.push('Leaf certificate is self-signed (not allowed), Leaf certificate must be issued by Intermediate certificate');
        chainOk = false;
      } else {
        info.push('Leaf certificate is not self-signed');
      }

      // Traverse Leaf -> Intermediate(s), check issuer / subject relationship
      for (let i = 0; i < certs.length - 1; i++) {
        const child = certs[i];
        const parent = certs[i + 1];

        if (child.issuer !== parent.subject) {
          errors.push(`Certificate chain error: the ${i + 1}th certificate issuer (${child.issuer}) does not match the ${i + 2}th certificate subject (${parent.subject})`);
          chainOk = false;
        } else {
          info.push(`The issuer of certificate ${i + 1} matches the subject of certificate ${i + 2}`);
        }
      }

      // The last certificate (usually Root or Intermediate CA)
      const last = certs[certs.length - 1];
      if (last.subject === last.issuer) {
        info.push('The last certificate is self-signed (Root CA)');
      } else {
        info.push('The last certificate is not self-signed (possibly missing Root CA)');
      }

      if (chainOk) {
        info.push('Certificate chain integrity validation passed');
        info.push(...chainInfo);
      } else {
        return { valid: false, errors, warnings, info };
      }
    } catch (err) {
      errors.push(`Certificate chain validation failed: ${err.message}, please check if the certificate chain format is correct`);
      return { valid: false, errors, warnings, info };
    }

    // 6. Feasibility detection (signature-verification)
    try {
      const testData = Buffer.from('TLS证书校验测试数据');
      const signature = crypto.sign('sha256', testData, privateKey);
      const pubKeyFromCert = x509Cert.publicKey;
      const verified = crypto.verify('sha256', testData, pubKeyFromCert, signature);
      if (verified) {
        info.push('Signature-verification test passed, certificate matches private key');
      } else {
        errors.push('Signature-verification test failed, certificate does not match private key');
        return { valid: false, errors, warnings, info };
      }
    } catch (err) {
      errors.push(`Signature-verification test failed: ${err.message}, please check if the certificate and private key match`);
      return { valid: false, errors, warnings, info };
    }

    // 7. Certificate validity period validation (optional)
    try {
      const now = new Date();
      const notBefore = x509Cert.validFrom;
      const notAfter = x509Cert.validTo;

      if (notBefore > now) {
        warnings.push(`Certificate not yet生效，生效时间：${notBefore.toISOString()}`);
      }

      if (notAfter < now) {
        errors.push(`Certificate has expired, expiration time: ${notAfter.toISOString()}`);
        return { valid: false, errors, warnings, info };
      }

      // 检查证书是否即将过期（30天内）
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (notAfter < thirtyDaysFromNow) {
        warnings.push(`Certificate will expire in 30 days, expiration time: ${notAfter.toISOString()}`);
      }

      info.push(`Certificate validity period: ${notBefore.toISOString()} to ${notAfter.toISOString()}`);
    } catch (err) {
      warnings.push(`Failed to verify certificate validity period: ${err.message}`);
    }

    // 8. 证书基本信息
    try {
      info.push(`Certificate subject: ${x509Cert.subject}`);
      info.push(`Certificate issuer: ${x509Cert.issuer}`);
      info.push(`Certificate serial number: ${x509Cert.serialNumber}`);
    } catch (err) {
      warnings.push(`Failed to get certificate basic information: ${err.message}`);
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : [],
      warnings: warnings.length > 0 ? warnings : [],
      info: info.length > 0 ? info : ['Certificate validation passed: all validation items passed'],
    };
  } catch (err) {
    return {
      valid: false,
      errors: [`Certificate validation unknown error: ${err.message}, please check if the certificate and private key data is complete`],
      warnings: [],
      info: [],
    };
  }
};

// Validate TLS certificate
exports.validateTlsCertificate = async (req, res) => {
  try {
    const { cert, key } = req.body;

    if (!cert || !key) {
      return res.status(400).json({
        code: 400,
        msg: 'Certificate and private key content cannot be empty',
        data: {
          valid: false,
          errors: ['Certificate and private key content cannot be empty'],
          warnings: [],
          info: [],
        },
      });
    }

    const validationResult = validateCertificate(cert, key);

    if (validationResult.valid) {
      res.status(200).json({
        code: 200,
        msg: 'Certificate validation passed',
        data: validationResult,
      });
    } else {
      res.status(400).json({
        code: 400,
        msg: 'Certificate validation failed',
        data: validationResult,
      });
    }
  } catch (err) {
    console.error('[BFF] Certificate validation error:', err);
    res.status(500).json({
      code: 500,
      msg: 'Certificate validation service error',
      data: {
        valid: false,
        errors: ['Server internal error'],
        warnings: [],
        info: [],
      },
    });
  }
};
