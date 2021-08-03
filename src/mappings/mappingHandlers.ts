// import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
// import {StarterEntity} from "../types";
// import {Balance} from "@polkadot/types/interfaces";
//
//
// export async function handleBlock(block: SubstrateBlock): Promise<void> {
//     //Create a new starterEntity with ID using block hash
//     let record = new StarterEntity(block.block.header.hash.toString());
//     //Record block number
//     record.field1 = block.block.header.number.toNumber();
//     await record.save();
// }
//
// export async function handleEvent(event: SubstrateEvent): Promise<void> {
//     const {event: {data: [account, balance]}} = event;
//     //Retrieve the record by its ID
//     const record = await StarterEntity.get(event.extrinsic.block.block.header.hash.toString());
//     record.field2 = account.toString();
//     //Big integer type Balance of a transfer event
//     record.field3 = (balance as Balance).toBigInt();
//     await record.save();
// }
//
// export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
//     const record = await StarterEntity.get(extrinsic.block.block.header.hash.toString());
//     //Date type timestamp
//     record.field4 = extrinsic.block.timestamp;
//     //Boolean tyep
//     record.field5 = true;
//     await record.save();
// }

// import {SignedBlock} from "@polkadot/types/interfaces";
// import {Extrinsic} from "../types/models/Extrinsic";
//
// export async function handleBlock(thisBlock: SignedBlock): Promise<void> {
//     const blockHash = thisBlock.block.header.hash.toString();
//
//     await Promise.all(thisBlock.block.extrinsics.map(async extrinsic => {
//         if (extrinsic.isSigned) {
//             const origin = extrinsic.signer.toString();
//             const entity = new Extrinsic(extrinsic.hash.toString());
//             entity.blockHash = blockHash;
//             entity.blockHeight = thisBlock.block.header.number.toBigInt();
//             entity.origin = origin;
//             await entity.save();
//         }
//     }));
//
// }
import { SubstrateBlock, SubstrateExtrinsic, SubstrateEvent } from '@subql/types'
import { TokenHandler } from '../handlers/token'
// import { AccountHandler } from '../handlers/account'


export async function handleBlock(currentBlock: SubstrateBlock): Promise<void> {

    await TokenHandler.ensureTokens(currentBlock);
    // await AccountHandler.ensureAccounts();

    // await handler.save()
}

// ======= Staking rewards ========

import {SumReward} from '../types/models/SumReward';
import {Balance} from '@polkadot/types/interfaces';
import {NoBondRecordAccount} from "../types/models/NoBondRecordAccount";
import {StakingReward, StakingSlash} from '../types/models';

function createSumReward(accountId: string): SumReward {
    const entity = new SumReward(accountId);
    entity.accountReward = BigInt(0);
    entity.accountSlash = BigInt(0);
    entity.accountTotal = BigInt(0);
    return entity;
}

export async function handleBond(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, balance]}} = event;
    const entity = await SumReward.get(account.toString());
    if (entity === undefined){
        await createSumReward(account.toString()).save();
    }
}


export async function handleReward(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    let entity = await SumReward.get(account.toString());
    if (entity === undefined){
        // in early stage of kusama, some validators didn't need to bond to start staking
        // to not break our code, we will create a SumReward record for them and log them in NoBondRecordAccount
        entity = createSumReward(account.toString());
        const errorRecord = new NoBondRecordAccount(account.toString());
        errorRecord.firstRewardAt = event.block.block.header.number.toNumber();
        await errorRecord.save();
    }

    entity.accountReward = entity.accountReward + (newReward as Balance).toBigInt();
    entity.accountTotal = entity.accountReward - entity.accountSlash;
    await entity.save();
}

export async function handleSlash(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newSlash]}} = event;
    let entity = await SumReward.get(account.toString());
    if (entity === undefined){
        // in early stage of kusama, some validators didn't need to bond to start staking
        // to not break our code, we will create a SumReward record for them and log them in NoBondRecordAccount
        entity = createSumReward(account.toString());
        const errorRecord = new NoBondRecordAccount(account.toString());
        errorRecord.firstRewardAt = event.block.block.header.number.toNumber();
        await errorRecord.save();
    }

    entity.accountSlash = entity.accountSlash + (newSlash as Balance).toBigInt();
    entity.accountTotal = entity.accountReward - entity.accountSlash;
    await entity.save();
}


export async function handleStakingReward(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    const entity = new StakingReward(`${event.block.block.header.number}-${event.idx.toString()}`);
    entity.address = account.toString();
    entity.balance = (newReward as Balance).toBigInt();
    entity.date = event.block.timestamp;
    await entity.save();
}

export async function handleStakingSlash(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newSlash]}} = event;
    const entity = new StakingSlash(`${event.block.block.header.number}-${event.idx.toString()}`);
    entity.address = account.toString();
    entity.balance = (newSlash as Balance).toBigInt();
    entity.date = event.block.timestamp;
    await entity.save();
}

