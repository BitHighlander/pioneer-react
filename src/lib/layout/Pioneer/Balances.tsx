import React, { useState, useEffect } from 'react';
import { Avatar, AvatarBadge, Box, Button, HStack, Stack, Image } from "@chakra-ui/react";
import { usePioneer } from "lib/context/Pioneer";

interface Balance {
    image?: string;
    symbol: string;
    balance?: any;
    size?: string;
    context?: string; // Added context field
}

import KEEPKEY_ICON from "lib/assets/png/keepkey.png";
import METAMASK_ICON from "lib/assets/png/metamask.png";
import PIONEER_ICON from "lib/assets/png/pioneer.png";

const getWalletType = (user: { walletDescriptions: any[] }, context: any) => {
    if (user && user.walletDescriptions) {
        const wallet = user.walletDescriptions.find((w) => w.id === context);
        return wallet ? wallet.type : null;
    }
    return null;
};

const getWalletBadgeContent = (walletType: string) => {
    const icons: any = {
        metamask: METAMASK_ICON,
        keepkey: KEEPKEY_ICON,
        native: PIONEER_ICON,
    };

    const icon = icons[walletType];

    if (!icon) {
        return null;
    }

    return (
        <AvatarBadge boxSize="1.25em" bg="green.500">
            <Image rounded="full" src={icon} />
        </AvatarBadge>
    );
};

export default function Balances(balances: { balances: Balance[] }) {
    const { state, dispatch } = usePioneer();
    const { user } = state;
    const [currentPage, setCurrentPage] = useState(1);
    const balancesPerPage = 3;
    const indexOfLastBalance = currentPage * balancesPerPage;
    const indexOfFirstBalance = indexOfLastBalance - balancesPerPage;
    const filteredBalances = balances.balances.filter((balance: Balance) => balance.balance !== 0);
    const sortedBalances = filteredBalances.sort((a: Balance, b: Balance) => b.balance - a.balance);
    const currentBalances = sortedBalances.slice(indexOfFirstBalance, indexOfLastBalance);
    const totalPages = Math.ceil(sortedBalances.length / balancesPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSendClick = (symbol: string) => {
        console.log(`Send clicked for balance: ${symbol}`);
    };

    const handleReceiveClick = (symbol: string) => {
        console.log(`Receive clicked for balance: ${symbol}`);
    };

    const handleViewClick = (symbol: string) => {
        console.log(`View clicked for balance: ${symbol}`);
    };

    useEffect(() => {
        const setUser = async () => {
            try {
                if (user && user.wallets) {
                    const { walletDescriptions, balances } = user;
                    console.log("walletDescriptions: ", walletDescriptions);
                    const updatedBalances = balances.map((balance: Balance) => {
                        const walletType = getWalletType(user, balance.context);
                        const badgeContent = getWalletBadgeContent(walletType);
                        // @ts-ignore
                        return {
                            ...balance,
                            context: {
                                ...balance.context,
                                badge: badgeContent,
                            },
                        };
                    });
                    dispatch({ type: 'SET_BALANCES', payload: updatedBalances });
                }
            } catch (e) {
                console.error("Error: ", e);
            }
        };

        setUser();
    }, [user]);

    return (
        <Stack spacing={4}>
            {currentBalances.map((balance: Balance, index: number) => (
                <Box key={index}>
                    <HStack spacing={4} alignItems="center">
                        <Avatar src={balance.image}>
                            <Box position="relative">
                                {balance.context && balance.context.badge}
                            </Box>
                        </Avatar>
                        <Box>
                            <small>asset: {balance.symbol}</small>
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
