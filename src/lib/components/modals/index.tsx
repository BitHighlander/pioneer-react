import React from "react";

export const ModalContext = React.createContext({
    walletModalOpen: false,
    setWalletModalOpen: (isOpen: boolean) => {},
    blockchainModalOpen: false,
    setBlockchainModalOpen: (isOpen: boolean) => {},
    settingsModalOpen: false,
    setSettingsModalOpen: (isOpen: boolean) => {},
});
