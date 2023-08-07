import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    Card,
    CardBody,
    TabPanel
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Balances from "lib/components/pioneer/Pioneer/Balances"
import Wallets from "lib/components/pioneer/Pioneer/Wallets"
import {usePioneer} from "lib/context/Pioneer";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const {state, dispatch} = usePioneer();
    const {api, app, user, context } = state;
    const [walletDescriptions, setWalletDescriptions] = useState([]);
    const [balances, setBalances] = useState([]);

    const setUser = async function () {
        try {
            if (user && user.wallets) {
                const { wallets, walletDescriptions, balances, pubkeys } = user;
                setWalletDescriptions(walletDescriptions);
                setBalances(balances);
            }
        } catch (e) {
            console.error("header e: ", e);
        }
    };

    useEffect(() => {
        setUser();
    }, [user]); // once on startup

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Pioneer Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs>
                        <TabList>
                            <Tab>NFTS</Tab>
                            <Tab>Balances</Tab>
                            <Tab>History</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <Card>
                                    <CardBody>
                                        <Wallets wallets={walletDescriptions}></Wallets>
                                    </CardBody>
                                </Card>
                            </TabPanel>
                            <TabPanel>
                                <Balances balances={balances}></Balances>
                            </TabPanel>
                            <TabPanel>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='ghost'>Secondary Action</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SettingsModal;
