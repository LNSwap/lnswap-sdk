import { AMMSwapPool } from '../utils/ammPool';
import { unwrapResponse } from 'clarity-codegen';
import { readonlyCall } from '../utils/readonlyCallExecutor';
import { Currency } from '../currency';
import { AlexSDK } from '../alexSDK';
import { getPairs } from '../utils/tokenlist';

export const getSwapRate = async (
  tokenX: Currency,
  tokenY: Currency,
  amount: bigint
): Promise<bigint> => {
  console.log('getSwapRate', tokenX, tokenY, amount);
  const tokens: any = await getPairs();
  // TODO: Only BTC/STX enabled for now
  let swapRate = BigInt(0);
  Object.keys(tokens).forEach((pair) => {
    const rate: number = tokens[pair].rate;
    if (pair === `BTC/STX`) {
      swapRate = BigInt(Math.floor(tokens[pair].rate));
    }
  });
  return swapRate;
}

export const getYAmountFromXAmount = async (
  tokenX: Currency,
  tokenY: Currency,
  fromAmount: bigint,
  ammPools: AMMSwapPool.PoolTokens[],
  ammV1_1Tokens: AMMSwapPool.Pool[]
): Promise<bigint> => {
  const ammV1_1Route = AMMSwapPool.getRoute(tokenX, tokenY, ammV1_1Tokens);
  if (ammV1_1Route.length === 1) {
    return await readonlyCall('amm-swap-pool-v1-1', 'get-helper', {
      'token-x': tokenX,
      'token-y': ammV1_1Route[0]!.neighbour,
      dx: fromAmount,
      factor: AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
    }).then(unwrapResponse);
  }
  if (ammV1_1Route.length === 2) {
    return await readonlyCall('amm-swap-pool-v1-1', 'get-helper-a', {
      'token-x': tokenX,
      'token-y': ammV1_1Route[0]!.neighbour,
      'token-z': ammV1_1Route[1]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammV1_1Route.length === 3) {
    return await readonlyCall('amm-swap-pool-v1-1', 'get-helper-b', {
      'token-x': tokenX,
      'token-y': ammV1_1Route[0]!.neighbour,
      'token-z': ammV1_1Route[1]!.neighbour,
      'token-w': ammV1_1Route[2]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammV1_1Route[2]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammV1_1Route.length === 4) {
    return await readonlyCall('amm-swap-pool-v1-1', 'get-helper-c', {
      'token-x': tokenX,
      'token-y': ammV1_1Route[0]!.neighbour,
      'token-z': ammV1_1Route[1]!.neighbour,
      'token-w': ammV1_1Route[2]!.neighbour,
      'token-v': ammV1_1Route[3]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammV1_1Route[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammV1_1Route[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammV1_1Route[2]!.pool),
      'factor-w': AMMSwapPool.getFactor(ammV1_1Route[3]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  const reachableInAMMV1_1 = AMMSwapPool.reachableInAMM(
    tokenX,
    tokenY,
    ammV1_1Tokens
  );
  if (reachableInAMMV1_1.type === 'fromAmm') {
    return await readonlyCall(
      'swap-helper-bridged-v1-1',
      'get-helper-from-amm',
      {
        dx: fromAmount,
        'token-x': reachableInAMMV1_1.tokenX,
        'token-y': reachableInAMMV1_1.tokenY,
        'token-z': reachableInAMMV1_1.tokenZ,
        'factor-x': reachableInAMMV1_1.factorX,
      }
    ).then(unwrapResponse);
  }
  if (reachableInAMMV1_1.type === 'toAmm') {
    return await readonlyCall('swap-helper-bridged-v1-1', 'get-helper-to-amm', {
      dx: fromAmount,
      'token-x': reachableInAMMV1_1.tokenX,
      'token-y': reachableInAMMV1_1.tokenY,
      'token-z': reachableInAMMV1_1.tokenZ,
      'factor-y': reachableInAMMV1_1.factorY,
    }).then(unwrapResponse);
  }

  const ammRoute = AMMSwapPool.getRoute(tokenX, tokenY, ammPools);
  if (ammRoute.length === 1) {
    return await readonlyCall('amm-swap-pool', 'get-helper', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      dx: fromAmount,
      factor: AMMSwapPool.getFactor(ammRoute[0]!.pool),
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 2) {
    return await readonlyCall('amm-swap-pool', 'get-helper-a', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 3) {
    return await readonlyCall('amm-swap-pool', 'get-helper-b', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'token-w': ammRoute[2]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  if (ammRoute.length === 4) {
    return await readonlyCall('amm-swap-pool', 'get-helper-c', {
      'token-x': tokenX,
      'token-y': ammRoute[0]!.neighbour,
      'token-z': ammRoute[1]!.neighbour,
      'token-w': ammRoute[2]!.neighbour,
      'token-v': ammRoute[3]!.neighbour,
      'factor-x': AMMSwapPool.getFactor(ammRoute[0]!.pool),
      'factor-y': AMMSwapPool.getFactor(ammRoute[1]!.pool),
      'factor-z': AMMSwapPool.getFactor(ammRoute[2]!.pool),
      'factor-w': AMMSwapPool.getFactor(ammRoute[3]!.pool),
      dx: fromAmount,
    }).then(unwrapResponse);
  }
  const reachableInAMM = AMMSwapPool.reachableInAMM(tokenX, tokenY, ammPools);
  if (reachableInAMM.type === 'fromAmm') {
    return await readonlyCall('swap-helper-bridged', 'get-helper-from-amm', {
      dx: fromAmount,
      'token-x': reachableInAMM.tokenX,
      'token-y': reachableInAMM.tokenY,
      'token-z': reachableInAMM.tokenZ,
      'factor-x': reachableInAMM.factorX,
    }).then(unwrapResponse);
  }
  if (reachableInAMM.type === 'toAmm') {
    return await readonlyCall('swap-helper-bridged', 'get-helper-to-amm', {
      dx: fromAmount,
      'token-x': reachableInAMM.tokenX,
      'token-y': reachableInAMM.tokenY,
      'token-z': reachableInAMM.tokenZ,
      'factor-y': reachableInAMM.factorY,
    }).then(unwrapResponse);
  }
  return await readonlyCall('swap-helper-v1-03', 'get-helper', {
    'token-x': tokenX,
    'token-y': tokenY,
    dx: fromAmount,
  }).then(unwrapResponse);
};
