import React, { useState, useCallback } from "react";

export const ModalContext = React.createContext({
    walletModalOpen: false,
    setWalletModalOpen: (isOpen: boolean) => {},
    blockchainModalOpen: false,
    setBlockchainModalOpen: (isOpen: boolean) => {},
    settingsModalOpen: false,
    setSettingsModalOpen: (isOpen: boolean) => {},
});

export const ModalProvider = ({ children }) => {
    const [walletModalOpen, setWalletModalOpen] = useState(false);
    const [blockchainModalOpen, setBlockchainModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    const handleSetSettingsModalOpen = useCallback((isOpen: boolean) => {
        setSettingsModalOpen(isOpen);
    }, []);

    return (
        <ModalContext.Provider
            value={{
                walletModalOpen,
                setWalletModalOpen,
                blockchainModalOpen,
                setBlockchainModalOpen,
                settingsModalOpen,
                setSettingsModalOpen: handleSetSettingsModalOpen,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
