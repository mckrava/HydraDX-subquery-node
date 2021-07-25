import { SubstrateBlock } from '@subql/types'
import { Token } from '../types/models/Token'
import { getAssetList } from '../helpers/token'

export class TokenHandler {

  static async ensureTokens (): Promise<void> {
    const chainTokensList = await getAssetList();

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