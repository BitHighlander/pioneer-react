import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, Spinner } from '@chakra-ui/react';
import { usePioneer } from "lib/context/Pioneer";

const Send = () => {
    const { state, dispatch } = usePioneer();
    const { user, app, api, wallet } = state;
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [txid, setTxid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // const handleSend = () => {
    //     setIsLoading(true);
    //     // Simulate sending process
    //     setTimeout(() => {
    //         setIsLoading(false);
    //         window.open('https://example.com', '_blank'); // Open link in a new tab
    //     }, 2000); // Simulated loading time
    //
    //     // TODO: Implement actual sending logic
    // };

    const handleSend = async () => {
        try {
            setIsLoading(true);
            const ASSET = "DAI";
            const balance = app.balances.filter((e: any) => e.symbol === ASSET);
            console.log("balance: ", balance);
            //@ts-ignore
            if (!balance) Alert(`No balance for asset ${ASSET}`);
            const TEST_AMOUNT = amount.toString(); // Use the selected amount
            // user selects balance to send
            const selectedBalance = balance[0];
            console.log("selectedBalance: ", selectedBalance);
            console.log("selectedBalance.symbol: ", selectedBalance.symbol);
            console.log("selectedBalance.contract: ", selectedBalance.contract);
            console.log("selectedBalance.symbol: ", selectedBalance.symbol);

            if(!address) alert("Must set an address!")
            if(!amount) alert("Must set an amount!")

            const send = {
                blockchain: "ethereum",
                network: "ETH", // eww
                asset: selectedBalance.symbol,
                contract: selectedBalance.contract,
                balance: selectedBalance.balance,
                address,
                amount,
                noBroadcast: false,
            };

            const tx = {
                type: "sendToAddress",
                payload: send,
            };

            console.log("tx: ", tx);
            let invocation = await app.build(tx);
            console.log("invocation: ", invocation);

            // sign
            invocation = await app.sign(invocation, wallet);
            // eslint-disable-next-line no-console
            console.log("invocation: ", invocation);

            // get txid
            const payload = {
                noBroadcast: false,
                sync: true,
                invocationId: "placeholder",
            };
            invocation.broadcast = payload;
            const resultBroadcast = await app.broadcast(invocation);
            console.log("resultBroadcast: ", resultBroadcast);
            console.log("resultBroadcast: ", resultBroadcast.broadcast);
            console.log("resultBroadcast: ", resultBroadcast.broadcast.txid);
            if(resultBroadcast.broadcast.txid){
                setTxid(resultBroadcast.broadcast.txid);
            }
            console.log("resultBroadcast: ", resultBroadcast.broadcast.success);
            setIsLoading(false);
            //TODO open block explorer link
            //window.open('https://example.com', '_blank'); // Open link in a new tab

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {txid ? (<div>
                txid: <small> {txid} </small>
                <Button>view on block explorer</Button>
            </div>) : (<div>
                <FormControl>
                    <FormLabel>Amount:</FormLabel>
                    <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Address:</FormLabel>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </FormControl>
            </div>)}

            <Button mt={4} colorScheme="blue" onClick={handleSend}>
                {isLoading ? <Spinner /> : 'Send'}
            </Button>
        </>
    );
};

export default Send;
