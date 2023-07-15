import React, { useState, useEffect } from 'react';
import {
    Avatar,
    AvatarBadge,
    Box,
    Button,
    HStack,
    Stack,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    InputGroup,
    InputLeftElement,
    Input,
} from "@chakra-ui/react";
import { usePioneer } from "lib/context/Pioneer";
import { Search2Icon } from '@chakra-ui/icons'
import Send from "./Send"
import View from "./View"
import Receive from "./Receive"

interface Balance {
    image?: string;
    symbol: string;
    name?: string;
    balance?: any;
    size?: string;
    context?: string; // Added context field
}

// Import icons
// @ts-ignore
import KEEPKEY_ICON from "lib/assets/png/keepkey.png";
// @ts-ignore
import METAMASK_ICON from "lib/assets/png/metamask.png";
// @ts-ignore
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

export default function Balances({ balances }: { balances: Balance[] }) {
    const { state, dispatch } = usePioneer();
    const { user } = state;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchQuery, setSearchQuery] = useState('');
    const balancesPerPage = 3;
    const indexOfLastBalance = currentPage * balancesPerPage;
    const indexOfFirstBalance = indexOfLastBalance - balancesPerPage;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSendClick = (balance: Balance) => {
        setSelectedBalance(balance);
        setSelectedAction('send');
        onOpen();
    };

    const handleReceiveClick = (balance: Balance) => {
        setSelectedBalance(balance);
        setSelectedAction('receive');
        onOpen();
    };

    const handleViewClick = (balance: Balance) => {
        setSelectedBalance(balance);
        setSelectedAction('view');
        onOpen();
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
                                // @ts-ignore
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

    // Filter and sort balances based on search query
    const filteredBalances = balances.filter((balance: Balance) => {
        // Convert the search query and balance symbol/name to lowercase for case-insensitive search
        const query = searchQuery.toLowerCase();
        const symbol = balance.symbol.toLowerCase();
        const name = balance.name ? balance.name.toLowerCase() : '';

        // Check if the symbol or name contains the search query
        return symbol.includes(query) || name.includes(query);
    });

    const sortedBalances = filteredBalances.sort((a: Balance, b: Balance) => b.balance - a.balance);
    const currentBalances = sortedBalances.slice(indexOfFirstBalance, indexOfLastBalance);
    const totalPages = Math.ceil(filteredBalances.length / balancesPerPage);

    return (
        <Stack spacing={4}>
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Search balances..."*/}
            {/*    value={searchQuery}*/}
            {/*    onChange={(e) => setSearchQuery(e.target.value)}*/}
            {/*/>*/}
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Search2Icon color='gray.300' />
                </InputLeftElement>
                <Input
                    placeholder='Bitcoin...'
                       type="text"
                    value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputGroup>
            {currentBalances.map((balance: Balance, index: number) => (
                <Box key={index}>
                    <HStack spacing={4} alignItems="center">
                        <Avatar src={balance.image}></Avatar>
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
                            onClick={() => handleSendClick(balance)}
                        >
                            Send
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReceiveClick(balance)}
                        >
                            Receive
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewClick(balance)}
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

            <Modal isOpen={isOpen} onClose={onClose} isCentered blockScrollOnMount={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedAction}</ModalHeader>
                    <ModalCloseButton />
                    {selectedAction === 'send' && (
                        <div>
                            <h3>Selected Action: Send</h3>
                            <p>Selected Asset: {selectedBalance?.symbol}</p>
                            <Send asset={selectedBalance}></Send>
                        </div>
                    )}
                    {selectedAction === 'receive' && (
                        <div>
                            <h3>Selected Action: Receive</h3>
                            <p>Selected Asset: {selectedBalance?.symbol}</p>
                            <Receive></Receive>
                        </div>
                    )}
                    {selectedAction === 'view' && (
                        <div>
                            <h3>Selected Action: View</h3>
                            <p>Selected Asset: {selectedBalance?.symbol}</p>
                            <View></View>
                        </div>
                    )}
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    );
}
