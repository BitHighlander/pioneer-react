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
    Select
} from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import {KeepKeyIcon} from "lib/assets/Icons/KeepKeyIcon";
// @ts-ignore
import KEEPKEY_ICON from "lib/assets/png/keepkey.png";
// @ts-ignore
import METAMASK_ICON from "lib/assets/png/metamask.png";
// @ts-ignore
import PIONEER_ICON from "lib/assets/png/pioneer.png";
import { MiddleEllipsis } from 'lib/components/utils';
import { ModalContext } from "lib/components/modals";
import { SetStateAction, useContext, useEffect, useState} from "react";
import Balances from "./Pioneer/Balances"
import Wallets from "./Pioneer/Wallets"
import {usePioneer} from "lib/context/Pioneer";

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

    return (
        <AvatarBadge boxSize="1.25em" bg="green.500">
            <Image rounded="full" src={icon}/>
        </AvatarBadge>
    );
};

const getWalletSettingsContent = (walletType: string) => {
    const icons: any = {
        metamask: METAMASK_ICON,
        keepkey: KEEPKEY_ICON,
        native: PIONEER_ICON,
    };

    const icon = icons[walletType];

    if (!icon) {
        return <div/>;
    }

    return icon;
};


const Pioneer = () => {
    const {state, dispatch} = usePioneer();
    const {api, app, user, context, wallets} = state;
    //modals
    const [walletModalOpen, setWalletModalOpen] = useState(false);
    const [blockchainModalOpen, setBlockchainModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    //local
    const [copySuccess, setCopySuccess] = useState(false);
    const [walletType, setWalletType] = useState("");
    const [walletDescriptions, setWalletDescriptions] = useState([]);
    const [walletsAvailable, setWalletsAvailable] = useState([]);
    const [metamaskPaired, setMetamaskPaired] = useState(false);
    const [keepkeyPaired, setKeepkeyPaired] = useState(false);
    const [nativePaired, setNativePaired] = useState(false);
    const [pioneerImage, setPioneerImage] = useState("");
    const [walletSettingsContext, setWalletSettingsContext] = useState("");
    const [assetContext, setAssetContext] = useState("");
    const [assetContextImage, setAssetContextImage] = useState("");
    const [blockchainContext, setBlockchainContext] = useState("");
    const [blockchainContextImage, setBlockchainContextImage] = useState("");
    const [isSynced, setIsSynced] = useState(false);
    const [isPioneer, setIsPioneer] = useState(false);
    const [isFox, setIsFox] = useState(false);
    const [pubkeys, setPubkeys] = useState([]);
    const [balances, setBalances] = useState([]);

    const setContextWallet = async function (wallet: string) {
        try {
            console.log("setContextWallet: ", wallet);
            // eslint-disable-next-line no-console
            console.log("wallets: ", wallets);
            const matchedWallet = wallets.find(
                (w: { type: string }) => w.type === wallet
            );
            console.log("matchedWallet: ", matchedWallet);
            if (matchedWallet) {
                setWalletType(matchedWallet.type);
                let context = await app.setContext(matchedWallet);
                dispatch({ type: "SET_CONTEXT", payload: context });
                dispatch({ type: "SET_WALLET", payload: wallet });
            } else {
                console.log("No wallet matched the type of the context");
            }
        } catch (e) {
            console.error("header e: ", e);
        }
    };

    const setUser = async function () {
        try {
            if (user && user.wallets) {
                const { wallets, walletDescriptions, balances, pubkeys } = user;
                // eslint-disable-next-line no-console
                console.log("wallets: ", wallets);

                if (user.isPioneer) {
                    console.log()
                    setIsPioneer(true);
                    setPioneerImage(user.pioneerImage);
                }

                for (let i = 0; i < walletDescriptions.length; i++) {
                    const wallet = walletDescriptions[i];
                    if (wallet.type === "keepkey") {
                        wallet.icon = KeepKeyIcon;
                    }
                    if (wallet.type === "metamask") {
                        setMetamaskPaired(true);
                    }
                    if (wallet.type === "keepkey") {
                        setKeepkeyPaired(true);
                    }
                    if (wallet.type === "native") {
                        setNativePaired(true);
                    }
                    wallet.paired = true;
                    walletDescriptions[i] = wallet;
                }
                // eslint-disable-next-line no-console
                console.log("walletDescriptions: ", walletDescriptions);
                // setWalletsAvailable(walletsAvailable);
                setWalletDescriptions(walletDescriptions);
                if(balances){
                    setBalances(balances);
                }

                // eslint-disable-next-line no-console
                //console.log("pubkeys: ", pubkeys);
                let newPubkeys:any = []
                console.log("walletDescriptions: ",user.walletDescriptions)
                for(let i = 0; i < pubkeys.length; i++) {
                    let pubkey = pubkeys[i];
                    let context = pubkey.context;
                    //console.log("context: ", context);
                    let walletType = walletDescriptions.filter((wallet: { context: any; }) => wallet.context === context)[0]?.type;
                    //console.log("walletType: ", walletType);
                    const icons:any = {
                        metamask: METAMASK_ICON,
                        keepkey: KEEPKEY_ICON,
                        native: PIONEER_ICON,
                    };
                    // @ts-ignore
                    let walletImage = icons[walletType];
                    //console.log("walletImage: ", walletImage);
                    pubkey.walletImage = walletImage;
                    newPubkeys.push(pubkey)
                }
                setPubkeys(newPubkeys);


                // @ts-ignore
                window.ethereum.on('accountsChanged', async function (accounts:any) {
                    // Time to reload your interface with accounts[0]!
                    //console.log('accountsChanged: ', accounts);
                    //TODO register new pubkeys
                    let walletsPaired = app.wallets
                    console.log("walletsPaired: ", walletsPaired);
                    //re-register metamask with more pubkeys
                    
                })

            }
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-console
            console.error("header e: ", e);
            // setKeepKeyError("Bridge is offline!");
        }
    };

    useEffect(() => {
        setUser();
    }, [user]); // once on startup

    const avatarContent = api ? (
        getWalletBadgeContent(walletType)
    ) : (
        <AvatarBadge boxSize="1em" bg="red.500">
            <CircularProgress isIndeterminate size="1em" color="white" />
        </AvatarBadge>
    );

    const blockchainOptions = ["Blockchain 1", "Blockchain 2", "Blockchain 3"]; // add your options here
    const contextOptions = ["Context 1", "Context 2", "Context 3"]; // add your options here


    return (
        <ModalContext.Provider value={{ walletModalOpen, setWalletModalOpen, blockchainModalOpen, setBlockchainModalOpen, settingsModalOpen, setSettingsModalOpen }}>
        <Menu>
            <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={300}
            >
                <Avatar size="lg">
                    {isPioneer ? (
                        <Avatar size="lg" src={pioneerImage}>
                            {avatarContent}
                        </Avatar>
                    ) : (
                        <Avatar size="lg" src={PIONEER_ICON}>
                            {avatarContent}
                        </Avatar>
                    )}
                </Avatar>
            </MenuButton>
            <MenuList>
                <Box borderBottomWidth="1px" p="4">
                    <HStack justifyContent="space-between">
                        <Button leftIcon={
                            <Avatar size="xs" src={getWalletSettingsContent(walletType)}>
                                <AvatarBadge boxSize="0.75em" bg="green.500" />
                            </Avatar>
                        }>
                            <small><MiddleEllipsis text={app?.context} /></small>
                        </Button>
                        <IconButton
                            icon={<FaCog />}
                            isRound
                            onClick={() => console.log("Settings Clicked")} // replace with your function
                        />
                    </HStack>
                </Box>
                <MenuItem>
                    <SimpleGrid columns={3} row={1}>
                        <Card align="center" onClick={() => setContextWallet("native")}>
                            <CardBody>
                                <Avatar src={PIONEER_ICON}>
                                    {nativePaired ? (
                                        <div>
                                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                                        </div>
                                    ) : (
                                        <div>
                                            <AvatarBadge boxSize="1.25em" bg="red.500" />
                                        </div>
                                    )}
                                </Avatar>
                            </CardBody>
                            <small>Pioneer</small>
                        </Card>
                        <Card align="center" onClick={() => setContextWallet("metamask")}>
                            <CardBody>
                                <Avatar src={METAMASK_ICON}>
                                    {metamaskPaired ? (
                                        <div>
                                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                                        </div>
                                    ) : (
                                        <div>
                                            <AvatarBadge boxSize="1.25em" bg="red.500" />
                                        </div>
                                    )}
                                </Avatar>
                            </CardBody>
                            <small>MetaMask</small>
                        </Card>
                        <Card align="center" onClick={() => setContextWallet("keepkey")}>
                            <CardBody>
                                <Avatar src={KEEPKEY_ICON}>
                                    {keepkeyPaired ? (
                                        <div>
                                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                                        </div>
                                    ) : (
                                        <div>
                                            <AvatarBadge boxSize="1.25em" bg="red.500" />
                                        </div>
                                    )}
                                </Avatar>
                            </CardBody>
                            <small>KeepKey</small>
                        </Card>
                    </SimpleGrid>
                </MenuItem>
                {/*<Tabs>*/}
                {/*    <TabList>*/}
                {/*        <Tab>NFTS</Tab>*/}
                {/*        <Tab>Balances</Tab>*/}
                {/*        <Tab>History</Tab>*/}
                {/*    </TabList>*/}

                {/*    <TabPanels>*/}
                {/*        <TabPanel>*/}
                {/*            <Card>*/}
                {/*                <CardBody>*/}
                {/*                    <Wallets wallets={walletDescriptions}></Wallets>*/}
                {/*                </CardBody>*/}
                {/*            </Card>*/}
                {/*        </TabPanel>*/}
                {/*        <TabPanel>*/}
                {/*            <Balances balances={balances}></Balances>*/}
                {/*        </TabPanel>*/}
                {/*        <TabPanel>*/}
                {/*        </TabPanel>*/}
                {/*    </TabPanels>*/}
                {/*</Tabs>*/}
            </MenuList>
        </Menu>
        </ModalContext.Provider>
    );
};

export default Pioneer;
