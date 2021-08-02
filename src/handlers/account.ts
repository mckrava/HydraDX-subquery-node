import { Account } from '../types';
// import { getAccountsList } from '../helpers/account';
import { ChainAccount } from '../appTypes/types';

export class AccountHandler {
  private account: ChainAccount;

  // static async ensureAccounts() {
  //   const chainAccountsList = await getAccountsList();
  //
  //   await Promise.all(
  //     chainAccountsList.map(async accountItem => {
  //       await this.ensureAccount(accountItem);
  //     })
  //   );
  // }
  // TODO we can ensure account only in transaction action and cannot fetch all accounts in the chain.
  // static async ensureAccount(accountData: ChainAccount) {
  //   const existingAccount = await Account.get(accountData.id);
  //
  //   if (!existingAccount) {
  //     const newAccount = new Account(accountData.id);
  //
  //     newAccount.specVersion = accountData.specVersion;
  //     newAccount.tradeTransferOut = accountData.tradeTransferOut || [];
  //     newAccount.tradeTransferIn = accountData.tradeTransferIn || [];
  //
  //     await newAccount.save();
  //   }
  // }

  // static async getAccountById(id: string) {
  //   await this.ensureAccount(id);
  //
  //   const account = await Account.get(id);
  //
  //   return account;
  // }
  //
  // static async updateAccount(id: string, data: Record<string, any>) {
  //   const account = await this.getAccountById(id);
  //
  //   Object.keys(data).forEach((key, value) => {
  //     account[key] = value;
  //   });
  //
  //   await account.save();
  // }
}
