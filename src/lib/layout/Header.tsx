import { Box, Flex } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const onStart = async function () {
    try {
      // if(!wallet)
      //   await connect();
      //set color mode dark
      localStorage.setItem("chakra-ui-color-mode", "dark");
      // eslint-disable-next-line no-console

    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error("header e: ", e);
      // setKeepKeyError("Bridge is offline!");
    }
  };
  useEffect(() => {
    onStart();
  }, []); // once on startup
  
  return (
    <Flex
      as="header"
      width="full"
      align="center"
      alignSelf="flex-start"
      justifyContent="center"
      gridGap={2}
    >
      <Box marginLeft="auto">
        <ThemeToggle />
      </Box>
    </Flex>
  );
};

export default Header;
