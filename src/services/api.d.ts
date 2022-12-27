declare namespace Service {
  
  interface Factor {
    pageNum: number,
    pageSize: number,
    name?: string,
  }

  interface Item {
    id: string,
    name: string,
    protocol: string,
    ports: number[],
  }

}

