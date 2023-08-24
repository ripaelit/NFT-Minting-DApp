import blocknativeIcon from '../assets/icons/blocknative-icon';

import { init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseModule from '@web3-onboard/coinbase';
import gas from '@web3-onboard/gas';

// Replace with your DApp's Infura ID
const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const network= process.env.REACT_APP_NETWORK;

const injected = injectedModule()

const coinbase = coinbaseModule();

const walletConnect = walletConnectModule({
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID
});

export const initWeb3Onboard = init({
  connect: {
    autoConnectAllPreviousWallet: true
  },
  wallets: [
    injected,
    walletConnect,
    coinbase,
  ],
  chains: [
    // {
    //   id: '0x1',
    //   token: 'ETH',
    //   label: 'Ethereum',
    //   rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    // },
    // {
    //   id: '0x5',
    //   token: 'ETH',
    //   label: 'Goerli',
    //   rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`
    // },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Polygon',
      rpcUrl: `https://rpc-mainnet.maticvigil.com`
    },
    {
      id: '0x13881',
      token: 'MATIC',
      label: 'Mumbai',
      rpcUrl: `https://rpc-mumbai.maticvigil.com/`
    },
  ],
  appMetadata: {
    name: 'Blocknative Web3-Onboard',
    icon: blocknativeIcon,
    description: 'Demo app for Web3-Onboard',
    recommendedInjectedWallets: [
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      { name: 'MetaMask', url: 'https://metamask.io' }
    ],
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://www.blocknative.com/terms-conditions',
      privacyUrl: 'https://www.blocknative.com/privacy-policy'
    },
    gettingStartedGuide: 'https://blocknative.com',
    explore: 'https://blocknative.com'
  },
  accountCenter: {
    desktop: {
      position: 'topRight',
      enabled: false,
      minimal: false
    }
  },
  // example customizing copy
  i18n: {
    es: {
      connect: {
        selectingWallet: {
          header: 'Carteras disponibles',
          sidebar: {
            heading: 'Comenzar',
            subheading: 'Conecta tu monedero',
            paragraph:
              'Conectar su billetera es como “iniciar sesión” en Web3. Seleccione su billetera de las opciones para comenzar.'
          }
        }
      },
      accountCenter: {
        connectAnotherWallet: 'Conectar otro monedero',
        disconnectAllWallets: 'Desconectar todos los monederos',
        currentNetwork: 'Red actual',
        appInfo: 'Información de la aplicación',
        learnMore: 'Aprende más',
        gettingStartedGuide: 'Guía de introducción',
        smartContracts: 'Contrato(s) inteligente',
        explore: 'Explorar',
        backToApp: 'Volver a dapp',
        poweredBy: 'Funciona con',
        addAccount: 'Añadir cuenta',
        setPrimaryAccount: 'Establecer cuenta principal',
        disconnectWallet: 'Desconectar Wallet'
      }
    }
  },
  notify: {
    transactionHandler: transaction => {
      if (transaction.eventCode === 'txPool') {
        return {
          // autoDismiss set to zero will persist the notification until the user excuses it
          autoDismiss: 0,
          // message: `Your transaction is pending, click <a href="https://goerli.etherscan.io/tx/${transaction.hash}" rel="noopener noreferrer" target="_blank">here</a> for more info.`,
          // or you could use onClick for when someone clicks on the notification itself
          onClick: () =>{
            if(network === "PRODUCT") {
              window.open(`https://mainnet.etherscan.io/tx/${transaction.hash}`);
            } else {
              window.open(`https://goerli.etherscan.io/tx/${transaction.hash}`);
            }

          }
        }
      }
    }
  },
  theme: 'dark'
});

// subscribe to a single chain for estimates using the default poll rate of 5 secs
// API key is optional and if provided allows for faster poll rates
export const ethMainnetGasBlockPrices = gas.stream({
  chains: ['0x1'],
  endpoint: 'blockPrices'
});
