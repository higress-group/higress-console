const { proxyRequest } = require('../utils/proxy');
const crypto = require('crypto');

// 获取TLS证书列表
exports.getTlsCertificates = async (req, res) => {
  try {
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/v1/tls-certificates',
      'GET',
      forwardHeaders,
      '',
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 获取TLS证书列表错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 添加TLS证书
exports.addTlsCertificate = async (req, res) => {
  try {
    const body = JSON.stringify(req.body);
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      '/v1/tls-certificates',
      'POST',
      forwardHeaders,
      body,
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 添加TLS证书错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 删除TLS证书
exports.deleteTlsCertificate = async (req, res) => {
  try {
    // 获取对应证书的name
    const { name } = req.params;
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      `/v1/tls-certificates/${name}`,
      'DELETE',
      forwardHeaders,
      '',
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 删除TLS证书错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 更新TLS证书
exports.updateTlsCertificate = async (req, res) => {
  try {
    // 获取对应证书的name
    const { name } = req.params;
    const body = JSON.stringify(req.body);
    // 只保留必要的头部（Cookie）
    const { headers } = req;
    // 只保留必要的头部（Cookie）
    const forwardHeaders = {
      Connection: 'keep-alive',
      'Content-Type': 'application/json',
      'Content-Length': body.length,
      Cookie: headers['cookie'] || '', // 直接转发浏览器的Cookie头
    };

    const result = await proxyRequest(
      `/v1/tls-certificates/${name}`,
      'PUT',
      forwardHeaders,
      body,
    );

    // 直接返回后端返回的数据，不做任何处理（包括响应头和数据）
    Object.keys(result.headers).forEach(headerName => {
      res.setHeader(headerName, result.headers[headerName]);
    });
    res.status(result.statusCode).end(result.data);
  } catch (err) {
    console.error('[BFF] 更新TLS证书错误:', err);
    res.status(502).json({ code: 502, msg: '后端服务不可用' });
  }
};

// 证书校验工具函数
const validateCertificate = (cert, key) => {
  const errors = [];
  const warnings = [];
  const info = [];

  try {
    // ========== 基础校验 ==========
    // 1. 验证证书格式合法性
    if (!cert || typeof cert !== 'string') {
      errors.push('证书内容不能为空，请检查证书数据是否已正确输入');
      return { valid: false, errors, warnings, info };
    }

    // 检查PEM格式
    if (!cert.includes('-----BEGIN CERTIFICATE-----') || !cert.includes('-----END CERTIFICATE-----')) {
      errors.push('证书格式不正确，请确保使用标准的PEM格式（以-----BEGIN CERTIFICATE-----开头，以-----END CERTIFICATE-----结尾）');
      return { valid: false, errors, warnings, info };
    }

    // 2. 验证私钥格式合法性
    if (!key || typeof key !== 'string') {
      errors.push('私钥内容不能为空，请检查私钥数据是否已正确输入');
      return { valid: false, errors, warnings, info };
    }

    if (!key.includes('-----BEGIN') || !key.includes('-----END')) {
      errors.push('私钥格式不正确，请确保使用标准的PEM格式（以-----BEGIN开头，以-----END结尾）');
      return { valid: false, errors, warnings, info };
    }

    // 3. 解析证书和私钥，验证密钥完整性
    let certificate;
    let privateKey;
    let x509Cert;

    try {
      certificate = crypto.createPublicKey(cert);
      x509Cert = new crypto.X509Certificate(cert);
      info.push('证书格式验证通过');
    } catch (err) {
      errors.push(`证书解析失败: ${err.message}，请检查证书内容是否完整且格式正确`);
      return { valid: false, errors, warnings, info };
    }

    try {
      privateKey = crypto.createPrivateKey(key);
      info.push('私钥格式验证通过');
    } catch (err) {
      errors.push(`私钥解析失败: ${err.message}，请检查私钥内容是否完整且格式正确`);
      return { valid: false, errors, warnings, info };
    }

    // 4. 算法类型和密钥长度验证
    try {
      const keyType = privateKey.asymmetricKeyType;
      const keyDetails = privateKey.asymmetricKeyDetails;
      switch (keyType) {
        case 'rsa':
          info.push('算法类型: RSA');
          if (keyDetails && keyDetails.modulusLength) {
            info.push(`RSA密钥长度: ${keyDetails.modulusLength}位`);
            if (keyDetails.modulusLength < 2048) {
              warnings.push('RSA密钥长度小于2048位，建议使用更长的密钥以确保安全性');
            }
          }
          break;
        case 'ec':
          info.push('算法类型: 椭圆曲线 (EC)');
          if (keyDetails && keyDetails.namedCurve) {
            info.push(`椭圆曲线: ${keyDetails.namedCurve}`);
            // 检查曲线安全性
            const secureCurves = ['P-256', 'P-384', 'P-521', 'secp256r1', 'secp384r1', 'secp521r1'];
            if (!secureCurves.includes(keyDetails.namedCurve)) {
              warnings.push(`椭圆曲线 ${keyDetails.namedCurve} 可能不够安全，建议使用P-256、P-384或P-521`);
            }
          }
          break;
        case 'ed25519':
          info.push('算法类型: Ed25519');
          info.push('Ed25519密钥长度: 256位');
          break;
        case 'ed448':
          info.push('算法类型: Ed448');
          info.push('Ed448密钥长度: 448位');
          break;
        case 'dsa':
          info.push('算法类型: DSA');
          warnings.push('DSA算法已过时，建议使用RSA或椭圆曲线算法');
          break;
        default:
          warnings.push(`未知的密钥类型: ${keyType}`);
      }
    } catch (err) {
      warnings.push(`无法获取密钥详细信息: ${err.message}`);
    }

    // ========== 进阶校验 ==========

    // 5. 证书链完整性检验
    try {
      const certsPEM = cert.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g);
      if (!certsPEM || certsPEM.length === 0) {
        errors.push('未找到有效的证书数据');
        return { valid: false, errors, warnings, info };
      }

      info.push(`证书链包含 ${certsPEM.length} 个证书`);

      // 验证每个证书的格式
      for (let i = 0; i < certsPEM.length; i++) {
        try {
          crypto.createPublicKey(certsPEM[i]);
        } catch (err) {
          errors.push(`证书链中第${i + 1}个证书格式错误: ${err.message}`);
          return { valid: false, errors, warnings, info };
        }
      }

      // 检查证书链完整性要求：需要至少2个证书（Leaf + Intermediate）
      if (certsPEM.length < 2) {
        errors.push(`证书链不完整：需要至少包含Leaf和Intermediate证书（2个以上），当前只有${certsPEM.length}个证书`);
        return { valid: false, errors, warnings, info };
      }

      // 转成 Node.js X509Certificate 对象
      const certs = certsPEM.map(pem => new crypto.X509Certificate(pem));

      let chainOk = true;
      const chainInfo = [];

      // 显示证书链信息
      for (let i = 0; i < certs.length; i++) {
        chainInfo.push(`证书${i + 1}: 主体=${certs[i].subject}, 颁发者=${certs[i].issuer}`);
      }

      // 检查 Leaf 不是自签证书
      const leaf = certs[0];
      if (leaf.subject === leaf.issuer) {
        errors.push('Leaf证书是自签名的（不允许），Leaf证书必须由Intermediate证书签发');
        chainOk = false;
      } else {
        info.push('Leaf证书不是自签名的');
      }

      // 遍历 Leaf -> Intermediate(s)，检查 issuer / subject 关系
      for (let i = 0; i < certs.length - 1; i++) {
        const child = certs[i];
        const parent = certs[i + 1];

        if (child.issuer !== parent.subject) {
          errors.push(`证书链错误：第${i + 1}个证书的颁发者(${child.issuer})与第${i + 2}个证书的主体(${parent.subject})不匹配`);
          chainOk = false;
        } else {
          info.push(`证书${i + 1}的颁发者与证书${i + 2}的主体匹配`);
        }
      }

      // 最后的证书（通常是 Root 或 Intermediate CA）
      const last = certs[certs.length - 1];
      if (last.subject === last.issuer) {
        info.push('最后一个证书是自签名的（Root CA）');
      } else {
        info.push('最后一个证书不是自签名的（可能缺少 Root CA）');
      }

      if (chainOk) {
        info.push('证书链完整性验证通过');
        info.push(...chainInfo);
      } else {
        return { valid: false, errors, warnings, info };
      }
    } catch (err) {
      errors.push(`证书链验证失败: ${err.message}，请检查证书链格式是否正确`);
      return { valid: false, errors, warnings, info };
    }

    // 6. 可行性检测（签名-验签）
    try {
      const testData = Buffer.from('TLS证书校验测试数据');
      const signature = crypto.sign('sha256', testData, privateKey);
      const pubKeyFromCert = x509Cert.publicKey;
      const verified = crypto.verify('sha256', testData, pubKeyFromCert, signature);
      if (verified) {
        info.push('签名-验签测试通过，证书与私钥匹配');
      } else {
        errors.push('签名-验签测试失败，证书与私钥不匹配');
        return { valid: false, errors, warnings, info };
      }
    } catch (err) {
      errors.push(`签名-验签测试失败: ${err.message}，请检查证书和私钥是否匹配`);
      return { valid: false, errors, warnings, info };
    }

    // 7. 证书有效期验证（可选）
    try {
      const now = new Date();
      const notBefore = x509Cert.validFrom;
      const notAfter = x509Cert.validTo;

      if (notBefore > now) {
        warnings.push(`证书尚未生效，生效时间：${notBefore.toISOString()}`);
      }

      if (notAfter < now) {
        errors.push(`证书已过期，过期时间：${notAfter.toISOString()}`);
        return { valid: false, errors, warnings, info };
      }

      // 检查证书是否即将过期（30天内）
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (notAfter < thirtyDaysFromNow) {
        warnings.push(`证书将在30天内过期，过期时间：${notAfter.toISOString()}`);
      }

      info.push(`证书有效期: ${notBefore.toISOString()} 至 ${notAfter.toISOString()}`);
    } catch (err) {
      warnings.push(`无法验证证书有效期: ${err.message}`);
    }

    // 8. 证书基本信息
    try {
      info.push(`证书主体: ${x509Cert.subject}`);
      info.push(`证书颁发者: ${x509Cert.issuer}`);
      info.push(`证书序列号: ${x509Cert.serialNumber}`);
    } catch (err) {
      warnings.push(`无法获取证书基本信息: ${err.message}`);
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : [],
      warnings: warnings.length > 0 ? warnings : [],
      info: info.length > 0 ? info : ['证书校验通过：所有验证项目均通过'],
    };
  } catch (err) {
    return {
      valid: false,
      errors: [`证书校验过程中发生未知错误: ${err.message}，请检查证书和私钥数据是否完整`],
      warnings: [],
      info: [],
    };
  }
};

// 校验TLS证书
exports.validateTlsCertificate = async (req, res) => {
  try {
    const { cert, key } = req.body;

    if (!cert || !key) {
      return res.status(400).json({
        code: 400,
        msg: '证书和私钥内容不能为空',
        data: {
          valid: false,
          errors: ['证书和私钥内容不能为空'],
          warnings: [],
          info: [],
        },
      });
    }

    const validationResult = validateCertificate(cert, key);

    if (validationResult.valid) {
      res.status(200).json({
        code: 200,
        msg: '证书校验通过',
        data: validationResult,
      });
    } else {
      res.status(400).json({
        code: 400,
        msg: '证书校验失败',
        data: validationResult,
      });
    }
  } catch (err) {
    console.error('[BFF] 证书校验错误:', err);
    res.status(500).json({
      code: 500,
      msg: '证书校验服务异常',
      data: {
        valid: false,
        errors: ['服务器内部错误'],
        warnings: [],
        info: [],
      },
    });
  }
};
