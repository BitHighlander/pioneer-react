import React from "react";
import {
    Grid,
    Box,
    Avatar,
    VStack,
    IconButton,
    useDisclosure,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Heading,
    List,
    ListItem,
    Divider
} from "@chakra-ui/react";
import {
    FaUserPlus,
    FaInbox,
    FaMicrophone,
    FaHeadset,
    FaChevronDown
} from "react-icons/fa";
import CTASection from "./components/CTASection";
import SomeImage from "./components/SomeImage";
import SomeText from "./components/SomeText";

const Home = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef<HTMLButtonElement>(null);

    const avatars = [
        { id: 1, src: "avatar1.png" },
        { id: 2, src: "avatar2.png" },
        // Add more avatars as needed
    ];

    // Sample channels data
    const channels = ['General', 'Random', 'Games', 'Development'];

    return (
        <div>
            <SomeText />
            <SomeImage />
            <CTASection />

            <Box
                backgroundColor="gray.900"
                height="100vh"
                position="fixed"
                top="0"
                left="0"
                padding="2"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <VStack spacing={6} align="stretch">
                    {avatars.map((avatar) => (
                        <Avatar
                            key={avatar.id}
                            name="User name"
                            src={avatar.src}
                            size="md"
                            showBorder={true}
                        />
                    ))}
                    <Button ref={btnRef} colorScheme="purple" onClick={onOpen}>
                        P
                    </Button>
                </VStack>

                <VStack spacing={6} align="stretch">
                    <IconButton
                        aria-label="Add friend"
                        icon={<FaUserPlus />}
                        size="lg"
                        variant="ghost"
                        colorScheme="purple"
                    />

                    <IconButton
                        aria-label="Inbox"
                        icon={<FaInbox />}
                        size="lg"
                        variant="ghost"
                        colorScheme="purple"
                    />

                    <IconButton
                        aria-label="Voice"
                        icon={<FaMicrophone />}
                        size="lg"
                        variant="ghost"
                        colorScheme="purple"
                    />

                    <IconButton
                        aria-label="Settings"
                        icon={<FaHeadset />}
                        size="lg"
                        variant="ghost"
                        colorScheme="purple"
                    />
                </VStack>
            </Box>

            <Box
                backgroundColor="gray.800"
                height="100vh"
                position="fixed"
                top="0"
                left="80px" // Adjust based on your previous column width
                padding="10"
                display="flex"
                flexDirection="column"
                alignItems="start"
                justifyContent="start"
            >
                <Heading size="md" color="white" my="4">
                    Server Title
                </Heading>
                <Divider />
                <List mt="4" color="white">
                    {channels.map((channel, index) => (
                        <ListItem key={index}>
                            <IconButton
                                aria-label="Channel"
                                icon={<FaChevronDown />}
                                size="xs"
                                variant="ghost"
                                colorScheme="purple"
                            />
                            {channel}
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Create your account</DrawerHeader>

                        <DrawerBody>
                            {/* Your account and wallet information goes here */}
                        </DrawerBody>

                        <DrawerFooter>
                            {/* Any buttons or additional information goes here */}
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </div>
    );
};

export default Home;
