import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { initWeb3Onboard } from '../utils/services';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import Contract_Abi from '../utils/abi.json';


const ConnectContext = createContext();
const Contract_address = process.env.REACT_APP_CONTRACT_ADDRESS;
const INFURA_ID = process.env.REACT_APP_INFURA_ID;

function ConnectProvider({ children }) {

    const [{ wallet }, connect, disconnect] = useConnectWallet();

    const [, setWeb3Onboard] = useState(null);
    const [provider, setProvider] = useState(null)
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState('');
    const [, setChain] = useSetChain();
    const [totalMintNum, setTotalMintNum] = useState(0);
    const [publicSalePrice, setPublicSalePrice] = useState(0);
    const [nftCount, setNftCount] = useState(0);
    const network = process.env.REACT_APP_NETWORK;

    useEffect(() => {
        setWeb3Onboard(initWeb3Onboard)
    }, []);

    useEffect(() => {
        if (!wallet?.provider) {
            setProvider(null);
        } else {
            setProvider(new ethers.providers.Web3Provider(wallet.provider, 'any'));
        }

        if (!wallet) {
            setIsConnected(false);
        } else {
            setAccount(wallet?.accounts[0]?.address);
            setIsConnected(true);
        }
    }, [wallet]);


    const getInformation = async () => {
        if (!isConnected) return;
        let apiKey = "";
        if(network === "PRODUCT") {
            // apiKey = `https://mainnet.infura.io/v3/${INFURA_ID}`;
            apiKey = `https://rpc-mainnet.maticvigil.com`;
            
        } else {
            // apiKey = `https://goerli.infura.io/v3/${INFURA_ID}`;
            apiKey = `https://rpc-mumbai.maticvigil.com/`;
        }
        const jsonRpcProvider = new ethers.providers.JsonRpcProvider(apiKey);
        const contract = new ethers.Contract(
            Contract_address,
            Contract_Abi.abi,
            jsonRpcProvider
        );

        const _totoalMintNum = Number(await contract.getTotalMintNumber());
        const _publicSalePrice = Number(await contract.publicSalePrice()) / (10 ** 18);
        const _nftCount = Number(await contract.balanceOf(account));

        setTotalMintNum(_totoalMintNum);
        setPublicSalePrice(_publicSalePrice);
        setNftCount(_nftCount);
    }

    const connectWallet = async () => {
        const walletsConnected = await connect();
        if (Array.isArray(walletsConnected) && walletsConnected.length > 0) {
            setAccount(walletsConnected[0]?.accounts[0]?.address);
            setIsConnected(true);
            window.localStorage.setItem("connectedWallets", walletsConnected[0]?.label)
            toast.success("Success Connected!");

            if (network === "PRODUCT") {      
                console.log("network === PRODUCT", network)          
                setChain({ chainId: "0x89" })
            } else {
                console.log("network !== PRODUCT", network)          
                setChain({ chainId: "0x13881" })
            }
        } else {
            setAccount("");
            setIsConnected(false);
            toast.info("Action rejected!");
            return;
        }

    };

    const disconnectWallet = async () => {
        await disconnect(wallet);
        setAccount("");
        setIsConnected(false);
        toast.success("Success disconnected!");
        window.localStorage.removeItem('connectedWallets');
    };

    getInformation();

    return (
        <ConnectContext.Provider value={{ account, isConnected, connectWallet, disconnectWallet, provider, totalMintNum, publicSalePrice, nftCount, wallet }}>
            {children}
        </ConnectContext.Provider>
    );
}

// Custom hook to consume the context
function useConnect() {
    return useContext(ConnectContext);
}

export { ConnectProvider, useConnect };