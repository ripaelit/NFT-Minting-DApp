import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, InputGroup, Form } from "react-bootstrap";
import { Banner } from '../assets';
import { useConnect } from '../contexts/contexts';
import { toast } from 'react-toastify';
import Contract_Abi from '../utils/abi.json';
import { ethers, BigNumber } from "ethers";

const Contract_address = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function HomePage() {
    const [amount, setAmount] = useState(1);

    const { isConnected, provider, totalMintNum, publicSalePrice, nftCount, wallet } = useConnect();

    const [totalMintNumber, setTotalMintNumber] = useState();
    const [nftHolds, setNftHolds] = useState();

    useEffect(() => {
        setTotalMintNumber(totalMintNum);
    }, [totalMintNum])

    useEffect(() => {
        setNftHolds(nftCount);
    }, [nftCount])

    function incrementCount() {
        if (amount >= 10) {
            toast.warn("This field cannot exceed 10!")
        } else {
            let _amount = amount + 1;
            setAmount(_amount);
        }
    }
    function decrementCount() {
        if (amount > 1) {
            let _amount = amount - 1;
            setAmount(_amount);
        } 
    }


    const mintNFT = async () => {
        if (!isConnected) {
            toast.info("Please Connect Wallet!");
            return;
        } else {
            const balance = wallet.accounts[0].balance;
            const cost = ethers.utils.parseEther((publicSalePrice * amount).toString());
            const balance_i = Number(balance.MATIC);
            const cost_i = Number(publicSalePrice) * amount;
            if (balance_i >= cost_i) {
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    Contract_address,
                    Contract_Abi.abi,
                    signer
                );
                try {
                    const response = await contract.clientMint(amount, {
                        value: cost,
                    });
                    toast.success("Transaction started... Wait a few seconds.");
                    response.wait().then( async (res) => {
                        toast.success("Transaction completed.");
                        const _totoalMintNum = parseInt(await contract.getTotalMintNumber());
                        const _nftHolds = parseInt(await contract.balanceOf(wallet.accounts[0].address))
                        setTotalMintNumber(_totoalMintNum);
                        setNftHolds(_nftHolds);
                    });
                } catch (err) {
                    toast.warn("Transaction rejected.\n" + err.code);
                }
            } else {
                toast.warn("Insufficient balance!", ethers.utils.parseEther((publicSalePrice * amount).toString()));
                return
            }

        }
    }

    const changeAmount = (event) => {
        setAmount(event.target.value);
    }

    return (
        <div className="HomePage">
            <Container>
                <Row className='my-5 py-5 justify-content-center aligin-items-center'>
                    {/* <Col sm={12} md={6} className='mb-2'>
                        <div className='text-center'>
                            <Image src={Banner} width="80%" className='rounded-5 border border-5 me-auto egg-banner' />
                        </div>
                    </Col> */}
                    <Col sm={12} md={6} className='mb-2 d-flex flex-column justify-content-center aligin-items-center'>
                        <div className='text-white text-center fs-2 mb-3 title-fs'>Total Prize Pool: <span className='text-pop title-fs fs-1'>{totalMintNumber * publicSalePrice}</span> MATIC</div>
                        <div className='text-white text-center fs-3 mb-3 title-fs'>Mint Price: <span className='text-pop title-fs fs-1'>{(publicSalePrice)}</span> MATIC</div>
                        <div className='text-white text-center fs-3 mb-3 title-fs'>You have: <span className='text-pop title-fs fs-1'>{(nftHolds)}</span> NFTs</div>

                        <Col sm={10} md={6} className='mx-auto'>
                            <InputGroup>
                                <Button variant="outline-secondary" id="button-addon1" className='fs-1 px-4 text-white title-fs border-1 border-white' onClick={decrementCount}>
                                    -
                                </Button>
                                <Form.Control
                                    aria-label="Example text with button addon"
                                    aria-describedby="basic-addon1"
                                    className='text-center fs-2 text-pop title-fs'
                                    type='number'
                                    value={amount}
                                    onChange={changeAmount}
                                />
                                <Button variant="outline-secondary" id="button-addon1" className='fs-1 title-fs px-4 text-white border-1 border-white' onClick={incrementCount}>
                                    +
                                </Button>
                            </InputGroup>
                        </Col>


                        {isConnected ? (
                            <Row className='mt-3'>
                                {/* <p className='text-white mb-3 text-center title-fs'>Participants must hold 50M $GOOTS tokens to mint</p> */}
                                <Col sm={12} md={6} className='mb-2 mx-auto'>
                                    <Button className="mint-button py-2 px-4 title-fs rounded-5 border-white border-2 w-100" onClick={mintNFT}>Mint Now</Button>
                                </Col>
                            </Row>
                        ) : (
                            <Row className='mt-3'>
                                {/* <p className='text-white mb-3 text-center title-fs'>Participants must hold 50M $GOOTS tokens to mint</p> */}
                                <Col sm={12} md={6} className='mb-2 mx-auto'>
                                    <Button className="mint-button py-2 px-4 title-fs rounded-5 border-white border-2 w-100" onClick={mintNFT}>Mint Now</Button>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}