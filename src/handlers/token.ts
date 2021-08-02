import { SubstrateBlock } from '@subql/types'
import { Token } from '../types/models/Token'
import { getTokensList } from '../helpers/token'
import type { Hash } from '@polkadot/types/interfaces/runtime';

export class TokenHandler {

  static async ensureTokens (currentBlock: SubstrateBlock): Promise<void> {
    const currentBlockHash: Hash = currentBlock.block.header.hash;
    const chainTokensList = await getTokensList(currentBlockHash);

    await Promise.all(chainTokensList.map(async tokenItem => {

      const existingToken = await Token.get(tokenItem.id)

      if (!existingToken) {
        const token = new Token(tokenItem.id)

        token.name = tokenItem.name
        token.decimal = tokenItem.decimal

        await token.save()
      }

    }))
  }
}