import { configs } from '../config';
import { Currency } from '../currency';

export type TokenInfo = {
  type: 'fungibleToken';
  id: string;
  name: string;
  displayPrecision: number;
  icon: string;
  availableInSwap: boolean;
  contractAddress: string;
  decimals: number;
};

export function getPairs(): Promise<any> {
  const apiUrl = configs.IS_MAINNET ? 'https://api.lnswap.org:9007/getpairs' : 'https://testnet.lnswap.org:9007/getpairs';
  return fetch(apiUrl, {
    mode: 'cors',
  })
    .then((res) => res.json())
    .then((data) => data.pairs);
}

export function fetchTokenList(): Promise<TokenInfo[]> {
  const apiUrl = configs.IS_MAINNET ? 'https://api.lnswap.org:9007/getpairs' : 'https://testnet.lnswap.org:9007/getpairs';
  return fetch(apiUrl, {
    mode: 'cors',
  })
    .then((res) => res.json())
    .then((data) => data.pairs);
}

export async function fetchSwappableCurrency(): Promise<TokenInfo[]> {
  const tokens = await fetchTokenList();
  console.log('got tokens', tokens);
  const tokenList: any = [];
  // // key
  // Object.keys(tokens).forEach(() => {
  //   const pair0 = {
  //     name: 'BTC ⚡',
  //     type: 'fungibleToken',
  //     id: 'LNBTC',
  //     displayPrecision: 4,
  //     icon: 'https://app.lnswap.org/btc%20%E2%9A%A1.svg',
  //     availableInSwap: true,
  //     contractAddress: "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-bananas::BANANA",
  //     decimals: 6
  //   };
  //   const pair1 =     {
  //     type: "fungibleToken",
  //     id: "token-wstx",
  //     name: "STX",
  //     displayPrecision: 4,
  //     icon: "https://images.ctfassets.net/frwmwlognk87/4gSg3vYkO4Vg5XXGJJc70W/ee285c9d710a68ae4e66f703555519b2/STX.svg",
  //     availableInSwap: true,
  //     contractAddress: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx::wstx",
  //     decimals: 6
  //   };
  // //   {
  // //     "type": "fungibleToken",
  // //     "id": "token-wban",
  // //     "name": "BANANA",
  // //     "displayPrecision": 4,
  // //     "icon": "https://images.ctfassets.net/frwmwlognk87/1hmx3vgBUjCuf5TdC27sWu/fd10565fa2549c406cdefb84495f912e/BANANA.svg",
  // //     "availableInSwap": true,
  // //     "contractAddress": "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-bananas::BANANA",
  // //     "decimals": 6
  // // };
  //   // const pair1 = {
  //   //   name: key.split('/')[1],
  //   //   type: 'fungibleToken',
  //   //   id: key.split('/')[1],
  //   //   displayPrecision: 4,
  //   //   icon: 'https://images.ctfassets.net/frwmwlognk87/1hmx3vgBUjCuf5TdC27sWu/fd10565fa2549c406cdefb84495f912e/BANANA.svg',
  //   //   availableInSwap: true,
  //   //   contractAddress: "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-bananas::BANANA", // placeholder
  //   //   decimals: 6
  //   // };
  //   if (!tokenList.includes(pair0)) {
  //     tokenList.push(pair0);
  //   }
  //   if (!tokenList.includes(pair1)) {
  //     tokenList.push(pair1);
  //   }
  // });

  // static for now - only LN -> STX is supported.
  // TODO: Add other pairs later based on demand.
  const LNBTC = {
    name: 'BTC ⚡',
    type: 'fungibleToken',
    id: 'LNBTC',
    displayPrecision: 4,
    icon: 'https://app.lnswap.org/btc%20%E2%9A%A1.svg',
    availableInSwap: true,
    contractAddress: "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-bananas::BANANA",
    decimals: 6
  };
  tokenList.push(LNBTC);
  const STX =     {
    type: "fungibleToken",
    id: "token-wstx",
    name: "STX",
    displayPrecision: 4,
    icon: "https://images.ctfassets.net/frwmwlognk87/4gSg3vYkO4Vg5XXGJJc70W/ee285c9d710a68ae4e66f703555519b2/STX.svg",
    availableInSwap: true,
    contractAddress: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx::wstx",
    decimals: 6
  };
  tokenList.push(STX);
  console.log('tokenList', tokenList);
  return tokenList;
  // return tokens.filter(
  //   (x) =>
  //     x.availableInSwap && Object.values(Currency).includes(x.id as Currency)
  // );
}
