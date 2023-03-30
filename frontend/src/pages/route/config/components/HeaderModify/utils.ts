export const getheaderListByRes = (headerControl) => {
  const headerList: any = [];
  const { request = {}, response = {} } = headerControl || {};

  request?.add?.forEach((item) => {
    headerList.push({
      actionType: 'add',
      headerType: 'request',
      key: item.key,
      value: item.value,
    });
  });
  request?.set?.forEach((item) => {
    headerList.push({
      actionType: 'set',
      headerType: 'request',
      key: item.key,
      value: item.value,
    });
  });
  request?.remove?.forEach((item) => {
    headerList.push({
      actionType: 'remove',
      headerType: 'request',
      key: item,
      value: '',
    });
  });

  response?.add?.forEach((item) => {
    headerList.push({
      actionType: 'add',
      headerType: 'response',
      key: item.key,
      value: item.value,
    });
  });
  response?.set?.forEach((item) => {
    headerList.push({
      actionType: 'set',
      headerType: 'response',
      key: item.key,
      value: item.value,
    });
  });
  response?.remove?.forEach((item) => {
    headerList.push({
      actionType: 'remove',
      headerType: 'response',
      key: item,
      value: '',
    });
  });
  return headerList;
};
