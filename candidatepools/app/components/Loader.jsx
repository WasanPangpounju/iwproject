
import React from 'react'
import { RotateLoader } from 'react-spinners';

function Loader() {

    return (
        <div >
            <div className="fixed top-0 z-10 opacity-50 bg-black w-screen h-screen"></div>
            <div className="fixed top-0 z-30 flex justify-center items-center w-screen h-screen">
                <div>
                    <RotateLoader color="#F97201" />
                </div>
            </div>
        </div>
    )
}

export default Loader
