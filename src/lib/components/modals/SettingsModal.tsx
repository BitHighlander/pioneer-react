import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import Balances from "lib/components/pioneer/Pioneer/Balances";
import Wallets from "lib/components/pioneer/Pioneer/Wallets";
import Paths from "lib/components/pioneer/Pioneer/Paths";
import Pubkeys from "lib/components/pioneer/Pioneer/Pubkeys";
import { usePioneer } from "lib/context/Pioneer";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { state } = usePioneer();
  const { app } = state;
  const [activeTab, setActiveTab] = useState("wallets");

  useEffect(() => {
    console.log("app: ", app);
  }, [app, app?.wallets]);

  return (
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pioneer Settings</ModalHeader>
          <ModalCloseButton />

          <ModalBody display="flex">
            {/* Sidebar Navigation */}
            <Flex direction="column" width="200px" borderRight="1px solid gray" pr="2">
              <Box py="2" px="4" bg={activeTab === "wallets" ? "gray.200" : ""} cursor="pointer" onClick={() => setActiveTab("wallets")}>
                <Text>Wallets</Text>
              </Box>
              <Divider />
              <Box py="2" px="4" bg={activeTab === "paths" ? "gray.200" : ""} cursor="pointer" onClick={() => setActiveTab("paths")}>
                <Text>Paths</Text>
              </Box>
              <Divider />
              <Box py="2" px="4" bg={activeTab === "pubKeys" ? "gray.200" : ""} cursor="pointer" onClick={() => setActiveTab("pubKeys")}>
                <Text>PubKeys</Text>
              </Box>
              <Divider />
              <Box py="2" px="4" bg={activeTab === "balances" ? "gray.200" : ""} cursor="pointer" onClick={() => setActiveTab("balances")}>
                <Text>Balances</Text>
              </Box>
            </Flex>

            {/* Content */}
            <Box flex="1" pl="4">
              {activeTab === "wallets" && <Wallets wallets={app?.wallets || []} />}
              {activeTab === "paths" && <Paths paths={app?.paths || []} />}
              {activeTab === "pubKeys" && <Pubkeys pubkeys={app?.pubkeys || []} />}
              {activeTab === "balances" && <Balances balances={app?.balances || []} />}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
};

export default SettingsModal;
