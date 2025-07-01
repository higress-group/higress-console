#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 配置
const CONFIG = {
  // 源码目录
  srcDir: path.join(__dirname, '../src'),
  // 国际化文件目录
  localesDir: path.join(__dirname, '../src/locales'),
  // 需要检查的文件类型
  fileExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // 忽略的目录
  ignoreDirs: ['node_modules', 'dist', 'build', '.git'],
  // 国际化函数调用模式
  i18nPatterns: [
    /t\(['"`]([^'"`]+)['"`]\)/g, // t('key') 或 t("key")
    /t\(['"`]([^'"`]+)['"`]\s*\|\|\s*['"`]([^'"`]+)['"`]\)/g, // t('key') || 'fallback'
    /t\(`([^`]+)`\)/g, // t(`key`)
  ],
};

/**
 * 递归获取对象的所有键路径
 * @param {Object} obj - 对象
 * @param {string} prefix - 前缀
 * @returns {string[]} 键路径数组
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const currentKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...getAllKeys(obj[key], currentKey));
      } else {
        keys.push(currentKey);
      }
    }
  }

  return keys;
}

/**
 * 过滤无效的国际化键
 * @param {string} key - 国际化键
 * @returns {boolean} 是否为有效的国际化键
 */
function isValidI18nKey(key) {
  // 过滤掉明显不是国际化键的内容
  const invalidPatterns = [
    /^\s*$/, // 空字符串或只有空白字符
    /^[\\n\\t\\r]+$/, // 转义字符
    /^[0-9]+$/, // 纯数字
    /^[^a-zA-Z_]+$/, // 不包含字母和下划线的字符串
    /^\${.*}$/, // 模板字符串变量
    /^[^a-zA-Z_][^a-zA-Z0-9_.]*$/, // 不以字母或下划线开头的键
  ];

  return !invalidPatterns.some(pattern => pattern.test(key));
}

/**
 * 从文件中提取国际化键
 * @param {string} filePath - 文件路径
 * @returns {Set<string>} 国际化键集合
 */
function extractI18nKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();

  CONFIG.i18nPatterns.forEach(pattern => {
    for (let match = pattern.exec(content); match !== null; match = pattern.exec(content)) {
      if (match[1] && isValidI18nKey(match[1])) {
        keys.add(match[1]);
      }
    }
  });

  return keys;
}

/**
 * 获取所有源码文件
 * @returns {string[]} 文件路径数组
 */
function getSourceFiles() {
  const patterns = CONFIG.fileExtensions.map(ext => `${CONFIG.srcDir}/**/*.${ext}`);
  const files = [];

  patterns.forEach(pattern => {
    const matches = glob.sync(pattern, {
      ignore: CONFIG.ignoreDirs.map(dir => `**/${dir}/**`),
    });
    files.push(...matches);
  });

  return files;
}

/**
 * 加载国际化文件
 * @param {string} locale - 语言代码
 * @returns {Object} 国际化对象
 */
function loadLocaleFile(locale) {
  const filePath = path.join(CONFIG.localesDir, locale, 'translation.json');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ 国际化文件不存在: ${filePath}`);
    return {};
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ 解析国际化文件失败: ${filePath}`, error.message);
    return {};
  }
}

/**
 * 检查国际化文案
 */
function checkI18n() {
  console.log('🔍 开始检查国际化文案...\n');

  // 获取所有源码文件
  const sourceFiles = getSourceFiles();
  console.log(`📁 找到 ${sourceFiles.length} 个源码文件`);

  // 提取所有使用的国际化键
  const usedKeys = new Set();
  sourceFiles.forEach(file => {
    const keys = extractI18nKeys(file);
    keys.forEach(key => usedKeys.add(key));
  });

  console.log(`🔑 找到 ${usedKeys.size} 个使用的国际化键`);

  // 获取所有语言文件
  const locales = fs.readdirSync(CONFIG.localesDir)
    .filter(dir => fs.statSync(path.join(CONFIG.localesDir, dir)).isDirectory());

  console.log(`🌍 找到 ${locales.length} 个语言: ${locales.join(', ')}\n`);

  let hasIssues = false;

  // 检查每个语言文件
  locales.forEach(locale => {
    console.log(`📋 检查 ${locale} 语言文件:`);

    const localeData = loadLocaleFile(locale);
    const definedKeys = new Set(getAllKeys(localeData));

    // 检查未使用的键
    const unusedKeys = [...definedKeys].filter(key => !usedKeys.has(key));
    if (unusedKeys.length > 0) {
      console.log(`  ⚠️  发现 ${unusedKeys.length} 个未使用的键:`);
      unusedKeys.slice(0, 10).forEach(key => {
        console.log(`    - ${key}`);
      });
      if (unusedKeys.length > 10) {
        console.log(`    ... 还有 ${unusedKeys.length - 10} 个未使用的键`);
      }
      hasIssues = true;
    } else {
      console.log(`  ✅ 没有未使用的键`);
    }

    // 检查缺失的键
    const missingKeys = [...usedKeys].filter(key => !definedKeys.has(key));
    if (missingKeys.length > 0) {
      console.log(`  ❌ 发现 ${missingKeys.length} 个缺失的键:`);
      missingKeys.slice(0, 10).forEach(key => {
        console.log(`    - ${key}`);
      });
      if (missingKeys.length > 10) {
        console.log(`    ... 还有 ${missingKeys.length - 10} 个缺失的键`);
      }
      hasIssues = true;
    } else {
      console.log(`  ✅ 没有缺失的键`);
    }

    console.log('');
  });

  // 输出统计信息
  console.log('📊 统计信息:');
  console.log(`  - 源码文件: ${sourceFiles.length}`);
  console.log(`  - 使用的国际化键: ${usedKeys.size}`);
  console.log(`  - 语言文件: ${locales.length}`);

  // 输出详细的使用情况
  if (process.argv.includes('--verbose')) {
    console.log('\n📝 详细使用情况:');
    sourceFiles.forEach(file => {
      const keys = extractI18nKeys(file);
      if (keys.size > 0) {
        console.log(`  ${path.relative(CONFIG.srcDir, file)}:`);
        keys.forEach(key => {
          console.log(`    - ${key}`);
        });
      }
    });
  }

  if (hasIssues) {
    console.log('\n❌ 发现国际化文案问题，请检查上述警告和错误');
    process.exit(1);
  } else {
    console.log('\n✅ 国际化文案检查通过！');
  }
}

// 运行检查
if (require.main === module) {
  checkI18n();
}

module.exports = { checkI18n };
