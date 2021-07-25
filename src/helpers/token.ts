type TokenItem = {
    id: string;
    decimal: number;
    name: string;
}


export const getAssetList = async (): Promise<TokenItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetIds = await api.query.assetRegistry.assetIds.entries();
            const assetList: TokenItem[]  = [{ id: '0', name: 'HDX', decimal: 9999 }];

            assetIds.forEach(([assetName, id]) => {
                const assetId = api.createType('Option<u32>', id).toString();
                const name = assetName.toHuman()?.toString() || '0xERR';

                assetList[assetId] = { id: assetId, name, decimal: 9999 };
            });
            // logger.info(`[DEBUG getAssetList assetList] >>> ${JSON.stringify(assetList)}`)

            resolve(assetList);
        } catch(e) {
            logger.warn(`[DEBUG getAssetList ERROR] >>> ${e.message}`)
            reject(e);
        }
    });
};