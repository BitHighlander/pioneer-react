import React, { useState } from 'react';
import {
    Avatar,
    AvatarBadge,
    Box,
    Button,
    HStack,
    Stack,
} from "@chakra-ui/react";
import {usePioneer} from "lib/context/Pioneer";
interface Balance {
    image?: string;
    symbol: string;
    balance?: any;
    size?: string;
}
// @ts-ignore
import KEEPKEY_ICON from "lib/assets/png/keepkey.png";
// @ts-ignore
import METAMASK_ICON from "lib/assets/png/metamask.png";
// @ts-ignore
import PIONEER_ICON from "lib/assets/png/pioneer.png";

export default function Balances(balances: any) {
    const {state, dispatch} = usePioneer();
    const {api, user, context, wallets} = state;
    const [currentPage, setCurrentPage] = useState(1);
    const balancesPerPage = 3;
    const indexOfLastBalance = currentPage * balancesPerPage;
    const indexOfFirstBalance = indexOfLastBalance - balancesPerPage;
    const filteredBalances = balances.balances.filter((balance: any) => balance.balance !== 0);
    const sortedBalances = filteredBalances.sort((a: any, b: any) => b.balance - a.balance);
    const currentBalances = sortedBalances.slice(indexOfFirstBalance, indexOfLastBalance);
    const totalPages = Math.ceil(sortedBalances.length / balancesPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSendClick = (symbol: string) => {
        // Handle send click logic here
        console.log(`Send clicked for balance: ${symbol}`);
    };

    const handleReceiveClick = (symbol: string) => {
        // Handle receive click logic here
        console.log(`Receive clicked for balance: ${symbol}`);
    };

    const handleViewClick = (symbol: string) => {
        // Handle view click logic here
        console.log(`View clicked for balance: ${symbol}`);
    };

    return (
        <Stack spacing={4}>
            {currentBalances.map((balance: any, index: number) => (
                <Box key={index}>
                    <HStack spacing={4} alignItems="center">
                        <Avatar src={balance.image}>
                            <Box position="relative">
                                <AvatarBadge boxSize="1em" bg="green.500" position="absolute" top="50%" right={0} />
                                <AvatarBadge boxSize="1em" bg="blue.500" position="absolute" right={0} />
                            </Box>
                        </Avatar>
                        <Box>
                            <small>asset: {balance.asset}</small>
                            <br />
                            <small>balance: {balance.balance}</small>
                        </Box>
                    </HStack>
                    <HStack mt={2} spacing={2}>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendClick(balance.symbol)}
                        >
                            Send
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReceiveClick(balance.symbol)}
                        >
                            Receive
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewClick(balance.symbol)}
                        >
                            View
                        </Button>
                    </HStack>
                </Box>
            ))}
            <Box mt={4}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? "solid" : "outline"}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
            </Box>
        </Stack>
    );
}
