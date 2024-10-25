import yaml from 'js-yaml';

export const clearObjectVal = (obj, hash = new WeakMap()) => {
  if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof obj !== 'object') return '######';
  // 是对象的话就要进行深拷贝
  if (hash.get(obj)) return hash.get(obj);
  // eslint-disable-next-line
  let cloneObj = new obj.constructor();

  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  // hash.set(obj, cloneObj);
  hash.set(obj, '');
  for (let key in obj) {
    // eslint-disable-next-line
    if (obj && obj?.hasOwnProperty(key)) {
      // 实现一个递归清除
      cloneObj[key] = clearObjectVal(obj[key], hash);
    }
  }
  return cloneObj;
};

export const getYamlEmptyValString = (value) => {
  const clearObj = clearObjectVal(value);
  let yamlString = yaml.dump(clearObj, {});

  // eslint-disable-next-line @iceworks/best-practices/recommend-polyfill
  yamlString = yamlString.replaceAll("'######'", '');
  return yamlString;
};

export const isInternalResource = (name: string) => {
  return name && name.endsWith('.internal');
};
