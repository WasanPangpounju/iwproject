// "use client"

// import React from 'react'
// import Icon from '@mdi/react';
// import { mdiMonitor } from '@mdi/js';
// import { useState } from 'react';

// function Navbar() {

//     //font-size
//     const [fontSize,setFontSize] = useState('normal-font')

//     return (
//         <div className='bg-[#F97201] px-5 py-2 flex items-center '>
//             <div className={`${fontSize} bg-white rounded-full w-6 h-6 flex items-center justify-center text-black font-bold`}>
//                 A
//             </div>
//             <p className='text-white font-thin text-sm ms-2'>ขนาดตัวอักษร</p>
//             <div className='flex gap-2 ms-4'>
//                 <div onClick={() => setFontSize('small-font')} className='small-font hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6 flex justify-center items-center'>
//                     เล็ก
//                 </div>
//                 <div onClick={() => setFontSize('normal-font')} className='normal-font hover:cursor-pointer bg-white  px-3 rounded-lg  h-6 flex justify-center items-center'>
//                     ปกติ
//                 </div>
//                 <div onClick={() => setFontSize('big-font')} className='bit-font hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6  flex justify-center items-center'>
//                     ใหญ่
//                 </div>
//             </div>
//             <div className='ms-4 bg-white p1 w-6 h-6 rounded-full flex items-center justify-center'>
//                 <Icon path={mdiMonitor} size={.7} />
//             </div>
//             <p className='text-white font-thin text-sm ms-2'>แสดงผล</p>
//             <div className='flex gap-2 ms-4'>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-white py-1 px-2 text-xs font-thin'>
//                     อักษรขาวพื้นดำ
//                 </div>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-white text-black py-1 px-2 text-xs font-thin'>
//                     ปกติ
//                 </div>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-[#e7e703] py-1 px-2 text-xs font-thin'>
//                     อักษรเหลืองพื้นดำ
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Navbar

// "use client";

// import React from 'react';
// import Icon from '@mdi/react';
// import { mdiMonitor } from '@mdi/js';

// function Navbar({ setFontSize }) { // Accept setFontSize as a prop

//     return (
//         <div className='bg-[#F97201] px-5 py-2 flex items-center '>
//             <div className='bg-white rounded-full w-6 h-6 flex items-center justify-center text-black font-bold'>
//                 A
//             </div>
//             <p className='text-white font-thin text-sm ms-2'>ขนาดตัวอักษร</p>
//             <div className='flex gap-2 ms-4'>
//                 <div onClick={() => setFontSize('small-font')} className='small-font hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6 flex justify-center items-center'>
//                     เล็ก
//                 </div>
//                 <div onClick={() => setFontSize('normal-font')} className='normal-font hover:cursor-pointer bg-white px-3 rounded-lg h-6 flex justify-center items-center'>
//                     ปกติ
//                 </div>
//                 <div onClick={() => setFontSize('big-font')} className='big-font hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6 flex justify-center items-center'>
//                     ใหญ่
//                 </div>
//             </div>
//             <div className='ms-4 bg-white w-6 h-6 rounded-full flex items-center justify-center'>
//                 <Icon path={mdiMonitor} size={.7} />
//             </div>
//             <p className='text-white font-thin text-sm ms-2'>แสดงผล</p>
//             <div className='flex gap-2 ms-4'>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-white py-1 px-2 text-xs font-thin'>
//                     อักษรขาวพื้นดำ
//                 </div>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-white text-black py-1 px-2 text-xs font-thin'>
//                     ปกติ
//                 </div>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-[#e7e703] py-1 px-2 text-xs font-thin'>
//                     อักษรเหลืองพื้นดำ
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Navbar;


// "use client";

// import React from 'react';
// import Icon from '@mdi/react';
// import { mdiMonitor } from '@mdi/js';

// function Navbar({ setFontSize }) { // Accept setFontSize as a prop

//     return (
//         <div className='bg-[#F97201] px-5 py-2 flex items-center '>
//             <div className='bg-white rounded-full w-6 h-6 flex items-center justify-center text-black font-bold'>
//                 A
//             </div>
//             <p className='text-white font-thin text-sm ms-2'>ขนาดตัวอักษร</p>
//             <div className='flex gap-2 ms-4'>
//                 <div onClick={() => setFontSize('small-font')} className='small-font hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6 flex justify-center items-center'>
//                     เล็ก
//                 </div>
//                 <div onClick={() => setFontSize('normal-font')} className='normal-font hover:cursor-pointer bg-white px-3 rounded-lg h-6 flex justify-center items-center'>
//                     ปกติ
//                 </div>
//                 <div onClick={() => setFontSize('big-font')} className='big-font hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6 flex justify-center items-center'>
//                     ใหญ่
//                 </div>
//             </div>
//             <div className='ms-4 bg-white w-6 h-6 rounded-full flex items-center justify-center'>
//                 <Icon path={mdiMonitor} size={.7} />
//             </div>
//             <p className='text-white font-thin text-sm ms-2'>แสดงผล</p>
//             <div className='flex gap-2 ms-4'>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-white py-1 px-2 text-xs font-thin'>
//                     อักษรขาวพื้นดำ
//                 </div>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-white text-black py-1 px-2 text-xs font-thin'>
//                     ปกติ
//                 </div>
//                 <div className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-[#e7e703] py-1 px-2 text-xs font-thin'>
//                     อักษรเหลืองพื้นดำ
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Navbar;

// "use client";

// import React from 'react';
// import Icon from '@mdi/react';
// import { mdiMonitor } from '@mdi/js';

// function Navbar({ setFontSize, setBgColor }) { // Accept setBgColor as a prop

//     return (
//         <div className='bg-[#F97201] px-5 py-2 flex items-center '>
//             <div className='bg-white rounded-full w-6 h-6 flex items-center justify-center text-black font-bold'>
//                 A
//             </div>
//             <p className='text-white font-thin text-sm ms-2'>ขนาดตัวอักษร</p>
//             <div className='flex gap-2 ms-4'>
//                 <div onClick={() => setFontSize('small-font')} className='small-font hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6 flex justify-center items-center'>
//                     เล็ก
//                 </div>
//                 <div onClick={() => setFontSize('normal-font')} className='normal-font hover:cursor-pointer bg-white px-3 rounded-lg h-6 flex justify-center items-center'>
//                     ปกติ
//                 </div>
//                 <div onClick={() => setFontSize('big-font')} className='big-font hover:cursor-pointer bg-white py-1 px-3 rounded-lg h-6 flex justify-center items-center'>
//                     ใหญ่
//                 </div>
//             </div>
//             <div className='ms-4 bg-white w-6 h-6 rounded-full flex items-center justify-center'>
//                 <Icon path={mdiMonitor} size={.7} />
//             </div>
//             <p className='text-white font-thin text-sm ms-2'>แสดงผล</p>
//             <div className='flex gap-2 ms-4'>
//                 <div 
//                     onClick={() => setBgColor('bg-black text-white')} // Change background color and text color to white
//                     className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-white py-1 px-2 text-xs font-thin'>
//                     อักษรขาวพื้นดำ
//                 </div> 
//                 <div 
//                     onClick={() => setBgColor('bg-white text-black')} // Reset to default background and text color
//                     className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-white text-black py-1 px-2 text-xs font-thin'>
//                     ปกติ
//                 </div>
//                 <div 
//                     onClick={() => setBgColor('bg-black text-[#e7e703]')} // Change background color and text color to yellow
//                     className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-[#e7e703] py-1 px-2 text-xs font-thin'>
//                     อักษรเหลืองพื้นดำ
//                 </div>
               
//             </div>
//         </div>
//     );
// }

// export default Navbar;


"use client";

import React from 'react';
import Icon from '@mdi/react';
import { mdiMonitor } from '@mdi/js';

function Navbar({ setFontSize, setBgColor,setBgColorNavbar, fontSize,bgColorNavbar,bgColor   }) { // Accept setBgColor as a prop
// console.log('bgColorNavbar',bgColorNavbar);
// console.log('fontSize',fontSize);


    return (
        // <div className='`${setBgColor}` px-5 py-2 flex items-center '>
        <div className={`${bgColorNavbar} px-5 py-2 flex items-center `}>

            <div className={`bg-white rounded-full w-6 h-6 flex items-center justify-center text-black font-bold ${fontSize}`}>
                A
            </div>
            <p className={`text-white font-thin text-sm ms-2 ${fontSize}`}>ขนาดตัวอักษร</p>
            <div className='flex gap-2 ms-4'>
                <div onClick={() => setFontSize('small-font')} className={`small-font hover:cursor-pointer ${bgColor} py-1 px-3 rounded-lg h-6 flex justify-center items-center`}>

                    เล็ก
                </div>
                <div onClick={() => setFontSize('normal-font')} className={`normal-font hover:cursor-pointer ${bgColor} px-3 rounded-lg h-6 flex justify-center items-center`}>
                    ปกติ
                </div>
                <div onClick={() => setFontSize('big-font')} className={`big-font hover:cursor-pointer ${bgColor} py-1 px-3 rounded-lg h-6 flex justify-center items-center`}>
                    ใหญ่
                </div>
            </div>
            <div className={`ms-4 ${bgColor} w-6 h-6 rounded-full flex items-center justify-center`}>
                <Icon path={mdiMonitor} size={.7} />
            </div>
            <p className={`text-white font-thin text-sm ms-2 ${fontSize}`}>แสดงผล</p>
            <div className='flex gap-2 ms-4'>
                <div 
                    onClick={() => {
                        setBgColor('bg-black text-white'); // Change background to black and text to white
                        setBgColorNavbar('bg-black');
                    }}
                    className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-white py-1 px-2 text-xs font-thin'>
                    อักษรขาวพื้นดำ
                </div>
                {/* <div 
                    onClick={() => {
                        setBgColor('bg-black text-[#e7e703]'); // Change background to black and text to yellow
                        setBgColorNavbar('bg-black');

                    }}
                    className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-[#e7e703] py-1 px-2 text-xs font-thin'>
                    อักษรเหลืองพื้นดำ
                </div> */}
                 <div 
                    onClick={() => {
                        setBgColor('bg-black text-[#e7e703]'); // Change background to black and text to yellow
                        setBgColorNavbar('bg-black'); // Change navbar background to black
                    }}
                    className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-black text-[#e7e703] py-1 px-2 text-xs font-thin'>
                    อักษรเหลืองพื้นดำ
                </div>
                <div 
                    onClick={() => {
                        setBgColor('bg-white text-black'); // Reset to default background and text color
                        setBgColorNavbar('bg-[#F97201]');
                    }}
                    className='hover:cursor-pointer h-6 flex justify-center items-center rounded-lg bg-white text-black py-1 px-2 text-xs font-thin'>
                    ปกติ
                </div>
            </div>
        </div>
    );
}

export default Navbar;