import React, { useEffect, useState } from "react";
import { usePioneer } from "lib/context/Pioneer";

const Home = () => {
  const { state } = usePioneer();
  const { api, app, context, assetContext, blockchainContext, pubkeyContext } = state;
  const [address, setAddress] = useState("");

  useEffect(() => {
      console.log("pubkeyContext: ", pubkeyContext);
      setAddress(pubkeyContext.master || pubkeyContext.pubkey);
  }, [pubkeyContext]);
    
    return (
    <div>
        Context: {context}
        <br />
        Asset Context: {assetContext?.name}
        <br />
        Blockchain Context: {blockchainContext?.name}
        <br />
        Address: {pubkeyContext?.master || pubkeyContext?.pubkey}
        <br />
    </div>
  );
};

export default Home;
