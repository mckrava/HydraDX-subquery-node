export type ChainAccount = {
  id: string;
  specVersion: number;
  tradeTransferOut: any[];
  tradeTransferIn: any[];
};

export type TokenItem = {
  id: string;
  decimal: number;
  name: string;
};
