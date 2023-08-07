import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from "@chakra-ui/react";

const WalletModal = ({isOpen, onClose}) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Wallet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {/* Your Wallet Modal Content */}
            </ModalBody>

            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>Close</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);

export default WalletModal;
