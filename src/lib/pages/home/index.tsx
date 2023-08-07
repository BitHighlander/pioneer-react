import React from "react";

import { usePioneer } from "lib/context/Pioneer";

import CTASection from "./components/CTASection";
import SomeImage from "./components/SomeImage";
import SomeText from "./components/SomeText";

const Home = () => {
  const { state } = usePioneer();
  const { api, wallet, app } = state;

  const onStart = async function () {
    try {
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect(() => {
  //     onStart();
  // }, [api]);

  return (
    <div>
      <SomeText />
      <SomeImage />
      <CTASection />
    </div>
  );
};

export default Home;
