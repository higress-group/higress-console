export const getheaderListByHeaderControl = (headerControl) => {
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

export const getHeaderControlByHeaderList = (formData) => {
  const headerControl = {
    enabled: formData.enabled,
    request: {
      add: [],
      set: [],
      remove: [],
    },
    response: {
      add: [],
      set: [],
      remove: [],
    },
  };

  formData.headerList?.forEach((item) => {
    let newItem = {
      key: item.key,
      value: item.value,
    };
    if (item.actionType === 'remove') {
      newItem = item.key;
    }
    headerControl[item.headerType][item.actionType].push(newItem);
  });
  return headerControl;
};
