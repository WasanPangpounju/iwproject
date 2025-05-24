import React from "react";
import { BeatLoader } from "react-spinners";

function Loader() {
  return (
    <>
      <div className="fixed top-0 left-0 z-30 flex justify-center items-center w-screen h-screen">
        <div>
          <BeatLoader color="#F97201" />
        </div>
      </div>
    </>
  );
}

export default Loader;
