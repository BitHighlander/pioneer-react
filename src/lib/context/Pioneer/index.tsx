/*
    Pioneer SDK

        A ultra-light bridge to the pioneer platform

              ,    .  ,   .           .
          *  / \_ *  / \_      .-.  *       *   /\'__        *
            /    \  /    \,   ( ₿ )     .    _/  /  \  *'.
       .   /\/\  /\/ :' __ \_   -           _^/  ^/    `--.
          /    \/  \  _/  \-'\      *    /.' ^_   \_   .'\  *
        /\  .-   `. \/     \ /==~=-=~=-=-;.  _/ \ -. `_/   \
       /  `-.__ ^   / .-'.--\ =-=~_=-=~=^/  _ `--./ .-'  `-
      /        `.  / /       `.~-^=-=~=^=.-'      '-._ `._

                             A Product of the CoinMasters Guild
                                              - Highlander
  
    Wallet Providers:
    
    1. Metmask:
      if metamask derivice pioneer seed from metamask
      
    2. keepkey:
      If keepkey detected: use it, otherwise use the native adapter
      
    3. Native Adapter:
        If no wallets, use the native adapter
  


      Api Docs:
        * https://pioneers.dev/docs/
      Transaction Diagram
        * https://github.com/BitHighlander/pioneer/blob/master/docs/pioneerTxs.png


*/
import { KkRestAdapter } from "@keepkey/hdwallet-keepkey-rest";
import { KeepKeySdk } from "@keepkey/keepkey-sdk";
import { SDK } from "@pioneer-sdk/sdk";
import * as core from "@shapeshiftoss/hdwallet-core";
// import * as keplr from "@shapeshiftoss/hdwallet-keplr";
import * as metaMask from "@shapeshiftoss/hdwallet-metamask";
import type { NativeHDWallet } from "@shapeshiftoss/hdwallet-native";
import { NativeAdapter } from "@shapeshiftoss/hdwallet-native";
import { entropyToMnemonic } from "bip39";
import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { checkKeepkeyAvailability, timeout } from "lib/components/utils";

export enum WalletActions {
  SET_STATUS = "SET_STATUS",
  SET_USERNAME = "SET_USERNAME",
  SET_USER = "SET_WALLETS",
  // SET_WALLET_CONTEXT = "SET_WALLET_CONTEXT",
  // SET_BLOCKCHAIN_CONTEXT = "SET_BLOCKCHAIN_CONTEXT",
  // SET_ASSET_CONTEXT = "SET_ASSET_CONTEXT",
  // SET_PUBKEY_CONTEXT = "SET_PUBKEY_CONTEXT",
  // SET_WALLETS = "SET_WALLETS",
  // SET_WALLET_DESCRIPTIONS = "SET_WALLET_DESCRIPTIONS",
  // INIT_PIONEER = "INIT_PIONEER",
  SET_API = "SET_API",
  SET_APP = "SET_APP",
  SET_WALLET = "SET_WALLET",
  SET_WALLET_DESCRIPTIONS = "SET_WALLET_DESCRIPTIONS",
  ADD_WALLET = "ADD_WALLET",
  RESET_STATE = "RESET_STATE",
}

export interface InitialState {
  // keyring: Keyring;
  status: any;
  username: string;
  serviceKey: string;
  queryKey: string;
  context: string;
  asset: string;
  blockchain: string;
  pubkey: string;
  balances: any[];
  pubkeys: any[];
  wallets: any[];
  walletDescriptions: any[];
  totalValueUsd: number;
  // app: any;
  user: any;
  wallet: any;
  app: any;
  api: any;
}

const initialState: InitialState = {
  // keyring: new Keyring(),
  status: "disconnected",
  username: "",
  serviceKey: "",
  queryKey: "",
  context: "",
  asset: "",
  blockchain: "",
  pubkey: "",
  balances: [],
  pubkeys: [],
  wallets: [],
  walletDescriptions: [],
  totalValueUsd: 0,
  // app: {} as any,
  user: null,
  wallet: null,
  app: null,
  api: null,
};

export interface IPioneerContext {
  state: InitialState;
  username: string | null;
  context: string | null;
  status: string | null;
  totalValueUsd: number | null;
  user: any;
  // wallet: any;
  app: any;
  api: any;
}

export type ActionTypes =
  | { type: WalletActions.SET_STATUS; payload: any }
  | { type: WalletActions.SET_USERNAME; payload: string }
  // | { type: WalletActions.SET_BLOCKCHAIN_CONTEXT; payload: string }
  // | { type: WalletActions.SET_ASSET_CONTEXT; payload: string }
  // | { type: WalletActions.SET_PUBKEY_CONTEXT; payload: string }
  // | { type: WalletActions.SET_WALLET; payload: any }
  // | { type: WalletActions.SET_WALLET_DESCRIPTIONS; payload: any }
  | { type: WalletActions.SET_APP; payload: any }
  | { type: WalletActions.SET_API; payload: any }
  | { type: WalletActions.SET_USER; payload: any }
  // | { type: WalletActions.SET_WALLET_CONTEXT; payload: any }
  | { type: WalletActions.ADD_WALLET; payload: any }
  // | { type: WalletActions.SET_WALLET_DESCRIPTIONS; payload: any }
  // | { type: WalletActions.INIT_PIONEER; payload: boolean }
  | { type: WalletActions.RESET_STATE };

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_STATUS:
      return { ...state, status: action.payload };
    case WalletActions.SET_USERNAME:
      return { ...state, username: action.payload };
    // case WalletActions.SET_WALLET_CONTEXT:
    //   return { ...state, context: action.payload };
    // case WalletActions.SET_ASSET_CONTEXT:
    //   return { ...state, asset: action.payload };
    // case WalletActions.SET_PUBKEY_CONTEXT:
    //   return { ...state, pubkey: action.payload };
    // case WalletActions.SET_BLOCKCHAIN_CONTEXT:
    //   return { ...state, blockchain: action.payload };
    // case WalletActions.SET_WALLET:
    //   return { ...state, wallet: action.payload };
    // case WalletActions.SET_WALLET_DESCRIPTIONS:
    //   return { ...state, walletDescriptions: action.payload };
    // case WalletActions.ADD_WALLET:
    //   return { ...state, wallets: [...state.wallets, action.payload] };
    case WalletActions.SET_APP:
      return { ...state, app: action.payload };
    case WalletActions.SET_API:
      return { ...state, api: action.payload };
    // case WalletActions.SET_USER:
    //   return { ...state, user: action.payload };
    case WalletActions.RESET_STATE:
      return {
        ...state,
        api: null,
        user: null,
        username: null,
        context: null,
        status: null,
      };
    default:
      return state;
  }
};

const PioneerContext = createContext(initialState);

export const PioneerProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [username, setUsername] = useState<string | null>(null);
  // const [context, setContext] = useState<string | null>(null);
  const [wallets, setWallets] = useState([]);
  const [walletDescriptions, setWalletDescriptions] = useState([]);
  const [context, setContext] = useState<string | null>(null);
  const [blockchainContext, setBlockchainContext] = useState<string | null>(
    null
  );
  const [assetContext, setAssetContext] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const onStart = async function () {
    try {
      // eslint-disable-next-line no-console
      console.log("onStart***** ");
      const serviceKey: string | null = localStorage.getItem("serviceKey"); // KeepKey api key
      let queryKey: string | null = localStorage.getItem("queryKey");
      let username: string | null = localStorage.getItem("username");
      //@ts-ignore
      dispatch({ type: WalletActions.SET_USERNAME, payload: username });

      const isMetaMaskAvailable = (): boolean => {
        return (
          (window as any).ethereum !== undefined &&
          (window as any).ethereum.isMetaMask
        );
      };
      const keyring = new core.Keyring();
      const metaMaskAdapter = metaMask.MetaMaskAdapter.useKeyring(keyring);

      if (!queryKey) {
        queryKey = `key:${uuidv4()}`;
        localStorage.setItem("queryKey", queryKey);
      }
      if (!username) {
        username = `user:${uuidv4()}`;
        username = username.substring(0, 13);
        localStorage.setItem("username", username);
      }
      const blockchains = [
        "bitcoin",
        "ethereum",
        "thorchain",
        "bitcoincash",
        "litecoin",
        "binance",
        "cosmos",
        "dogecoin",
      ];

      // @TODO add custom paths from localstorage
      const paths: any = [];
      const spec =
          //@ts-ignore
        import.meta.env.VITE_PIONEER_URL_SPEC ||
          //@ts-ignore
        "https://pioneers.dev/spec/swagger.json";
      //@ts-ignore
      const wss = import.meta.env.VITE_PIONEER_URL_WS || "wss://pioneers.dev";
      const configPioneer: any = {
        blockchains,
        username,
        queryKey,
        spec,
        wss,
        paths,
      };
      const appInit = new SDK(spec, configPioneer);

      // Example usage
      let walletMetaMask: metaMask.MetaMaskHDWallet | undefined;
      if (isMetaMaskAvailable()) {
        // console.log("isMetaMaskAvailable ")
        walletMetaMask = await metaMaskAdapter.pairDevice();
        if (walletMetaMask) {
          // pair metamask
          await walletMetaMask.initialize();
          console.log("walletMetaMask: ", walletMetaMask);

          // get all accounts
          //@ts-ignore
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log("accounts: ", accounts);
          //@ts-ignore
          walletMetaMask.accounts = accounts;
          //@ts-ignore
          dispatch({ type: WalletActions.ADD_WALLET, payload: walletMetaMask });
        }
      } else {
        console.log("MetaMask is not available");
      }

      const isKeepkeyAvailable = await checkKeepkeyAvailability();
      console.log("isKeepkeyAvailable: ", isKeepkeyAvailable);

      let walletKeepKey: core.HDWallet;
      if (isKeepkeyAvailable) {
        const config: any = {
          apiKey: serviceKey || "notSet",
          pairingInfo: {
            name: "Pioneer",
            imageUrl: "https://i.imgur.com/BdyyJZS.png",
            basePath: "http://localhost:1646/spec/swagger.json",
            url: "https://pioneer-template.vercel.com",
          },
        };
        const sdkKeepKey = await KeepKeySdk.create(config);
        if (config.apiKey !== serviceKey) {
          localStorage.setItem("serviceKey", config.apiKey);
        }

        try {
          //@ts-ignore
          walletKeepKey = await Promise.race([
            //@ts-ignore
            KkRestAdapter.useKeyring(keyring).pairDevice(sdkKeepKey),
            timeout(30000),
          ]);
          // pair keepkey
          const successKeepKey = await appInit.pairWallet(walletKeepKey);
          console.log("successKeepKey: ", successKeepKey);
          //@ts-ignore
          dispatch({ type: WalletActions.ADD_WALLET, payload: walletKeepKey });
        } catch (error) {
          //@ts-ignore
          console.error("Error or Timeout:", error.message);
          alert("Please restart your KeepKey and try again.");
        }
      }

      let walletSoftware: NativeHDWallet | null;
      // let mnemonic;
      // let hashStored;
      // let hash;
      // const nativeAdapter = NativeAdapter.useKeyring(keyring);
      // //is metamask available AND no KeepKey
      // if (walletMetaMask && !isKeepkeyAvailable) {
      //   //generate software from metamask
      //   hashStored = localStorage.getItem('hash');
      //   if (!hashStored) {
      //     //generate from MM
      //     const message = 'Pioneers:0xD9B4BEF9:gen1';
      //     const { hardenedPath, relPath } = walletMetaMask.ethGetAccountPaths({
      //       coin: 'Ethereum',
      //       accountIdx: 0,
      //     })[0];
      //     const sig = await walletMetaMask.ethSignMessage({
      //       addressNList: hardenedPath.concat(relPath),
      //       message,
      //     });
      //     // @ts-ignore
      //     //console.log('sig: ', sig.signature);
      //     // @ts-ignore
      //     localStorage.setItem('hash', sig.signature);
      //     // @ts-ignore
      //     hashStored = sig.signature;
      //   }
      //   //console.log('hashStored: ', hashStored);
      //   const hashSplice = (str: string | any[] | null) => {
      //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //     // @ts-ignore
      //     return str.slice(0, 34);
      //   };
      //   // @ts-ignore
      //   hash = hashSplice(hashStored);
      //   // eslint-disable-next-line no-console
      //   //console.log('hash (trimmed): ', hash);
      //   // @ts-ignore
      //   const hashBytes = hash.replace('0x', '');
      //   //console.log('hashBytes', hashBytes);
      //   //console.log('hashBytes', hashBytes.length);
      //   mnemonic = entropyToMnemonic(hashBytes.toString(`hex`));
      //
      //   // get walletSoftware
      //   walletSoftware = await nativeAdapter.pairDevice('testid');
      //   await nativeAdapter.initialize();
      //   // @ts-ignore
      //   await walletSoftware.loadDevice({ mnemonic });
      //   const successSoftware = await appInit.pairWallet(walletSoftware);
      //   //console.log('successSoftware: ', successSoftware);
      //   // @ts-ignore
      //   dispatch({ type: WalletActions.ADD_WALLET, payload: walletSoftware });
      // }

      // if NO metamask AND NO KeepKey then generate new seed
      // @ts-ignore
      if (!walletMetaMask && !isKeepkeyAvailable && !walletSoftware) {
        // generate new seed
        // @TODO
        alert("No wallets found! unable to continue");
      } else {
        const walletPreferred =
            //@ts-ignore
          walletKeepKey || walletMetaMask || walletSoftware;
        //@ts-ignore
        console.log("walletPreferred: ", walletPreferred.type);

        //@ts-ignore
        dispatch({
          //@ts-ignore
          type: WalletActions.SET_CONTEXT,
          // @ts-ignore
          payload: walletPreferred.type,
        });
        //@ts-ignore
        dispatch({ type: WalletActions.SET_WALLET, payload: walletPreferred });

        // @ts-ignore
        const api = await appInit.init(walletPreferred);
        //@ts-ignore
        if (api) {
          // @ts-ignore
          dispatch({ type: WalletActions.SET_APP, payload: appInit });
          // @ts-ignore
          dispatch({ type: WalletActions.SET_API, payload: api });
          

          // @ts-ignore
          const user = await api.User();
          // eslint-disable-next-line no-console
          // console.log("user: ", user.data);

          if (walletMetaMask) {
            console.log("walletMetaMask found: ", walletMetaMask);
            const successMetaMask = await appInit.pairWallet(walletMetaMask);
            console.log("successMetaMask: ", successMetaMask);
          }
          // // @ts-ignore
          // if (walletSoftware) {
          //   const successnative = await appInit.pairWallet(walletSoftware);
          //   //console.log("successnative: ", successnative);
          // }

          const events = await appInit.startSocket();
          // console.log("events: ", events);

          events.on("message", (event: any) => {
            // console.log("event: ", event);
          });

          events.on("blocks", (event: any) => {
            // console.log("event: ", event);
          });

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dispatch({ type: WalletActions.SET_USER, payload: user.data });
          // setUsername(localStorage.getItem("username"));

          // eslint-disable-next-line no-console
          // console.log("user.data.context: ", user.data.context);
          // @TODO move context back to lable of wallet not wallet type
          // setContext(user.data.context);
          // let context = user.data.context;
          // let walletContext = user.data.walletDescriptions.filter(context);

          // set wallets
          if (user.data.wallets) setWallets(user.data.wallets);
          if (user.data.walletDescriptions)
            setWalletDescriptions(user.data.walletDescriptions);

          if (user.data.assetContext) {
            console.log("blockchainContext: ", user.data.blockchainContext);
            //setAssetContext(user.data.assetContext);
          }
          if (user.data.blockchainContext){
            console.log("blockchainContext: ", user.data.blockchainContext);
            // @ts-ignore
            //dispatch({ type: WalletActions.SET_BLOCKCHAIN_CONTEXT, payload: user.data.blockchainContext });
          }

          //DEFAULT TO ETH ON LOAD
          setAssetContext("ETH");
          // @ts-ignore
          dispatch({ type: WalletActions.SET_ASSET_CONTEXT, payload: "ETH" });
          // @ts-ignore
          dispatch({ type: WalletActions.SET_BLOCKCHAIN_CONTEXT, payload: "ethereum" });
          //set pubkey for chain on context
          const addressInfo = {
            addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
            coin: "Ethereum",
            scriptType: "ethereum",
            showDisplay: false,
          };
          // @ts-ignore
          const address = await walletPreferred.ethGetAddress(addressInfo);
          console.log("address: ", address);
          // @ts-ignore
          dispatch({ type: WalletActions.SET_PUBKEY_CONTEXT, payload: address });

          // if (user.data.blockchainContext){
          //   console.log("blockchainContext: ", user.data.blockchainContext);
          //   // @ts-ignore
          //   dispatch({ type: WalletActions.SET_BLOCKCHAIN_CONTEXT, payload: user.data.blockchainContext });
          // } else {
          //   // @ts-ignore
          //   dispatch({ type: WalletActions.SET_BLOCKCHAIN_CONTEXT, payload: "ethereum" });
          //
          //   //set pubkey for chain on context
          //   const addressInfo = {
          //     addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
          //     coin: "Ethereum",
          //     scriptType: "ethereum",
          //     showDisplay: false,
          //   };
          //   // @ts-ignore
          //   const address = await state.wallet.ethGetAddress(addressInfo);
          //   console.log("address: ", address);
          //   // @ts-ignore
          //   dispatch({ type: WalletActions.SET_PUBKEY_CONTEXT, payload: "address" });
          // }





          if (user.data.context) setContext(user.data.context);
          // eslint-disable-next-line no-console
          // //console.log("user: ", user);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  // onstart get data
  useEffect(() => {
    onStart();
  }, []);

  // end
  const value: any = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <PioneerContext.Provider value={value}>{children}</PioneerContext.Provider>
  );
};

export const usePioneer = (): any =>
  useContext(PioneerContext as unknown as React.Context<IPioneerContext>);
