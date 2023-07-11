import {
    chakra,
    Stack,
    CircularProgress,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Avatar,
    AvatarBadge,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Link,
    Menu,
    Image,
    MenuButton,
    MenuDivider,
    Icon,
    MenuItem,
    MenuList,
    Spacer,
    Text,
    useDisclosure,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    SimpleGrid,
    Card,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";
import React, { useState } from 'react';

interface Balance {
    image?: string;
    symbol: string;
    balance?: any;
    size?: string;
}

export default function Balance(balance: any) {
    const [hover, setHover] = useState<number | null>(null);

    return (
        <div>
            {/*{JSON.stringify(balance.balance)}*/}
            <Avatar size="sm" src={balance.balance.image} />
            <small>asset: {balance.balance.asset}</small>
            <small>balance: {balance.balance.balance}</small>
        </div>
    );
}
