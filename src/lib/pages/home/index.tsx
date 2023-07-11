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
  Divider,
} from "@chakra-ui/react";
import React from "react";
import {
  FaUserPlus,
  FaInbox,
  FaMicrophone,
  FaHeadset,
  FaChevronDown,
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
  const channels = ["General", "Random", "Games", "Development"];

  return (
    <div>
      <SomeText />
      <SomeImage />
      <CTASection />

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
