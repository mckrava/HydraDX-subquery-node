import { TokenItem } from '../appTypes/types';
import type { Hash } from '@polkadot/types/interfaces/runtime';

export const getTokensList = async (blockHash: Hash): Promise<TokenItem[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      // @ts-ignore
      // const assetIds = await api.query.assetRegistry.assetIds.entries.at(
      //   blockHash
      // );
      // logger.info(`[DEBUG getAssetList assetIds] >>> ${JSON.stringify(assetIds)}`)

      const assetIds = await api.query.assetRegistry.assetIds.entries();

      const assetList: TokenItem[] = [{ id: '0', name: 'HDX', decimal: 9999 }];

      assetIds.forEach(([assetName, id]) => {
        const assetId = api.createType('Option<u32>', id).toString();
        const name = assetName.toHuman()?.toString() || '0xERR';
        assetList[assetId] = { id: assetId, name, decimal: 9999 };
      });
      // logger.info(`[DEBUG getAssetList assetList] >>> ${JSON.stringify(assetList)}`)

      resolve(assetList);
    } catch (e) {
      logger.warn(`[DEBUG getAssetList ERROR] >>> ${e.message}`);
      reject(e);
    }
  });
};
