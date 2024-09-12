// import { Inter } from "next/font/google";
// import "./globals.css";
// import Navbar from "./components/Navbar";
// import '@fontsource/ibm-plex-sans-thai';
// import Footer from "./components/Footer";
// import { AuthProvider } from "./Provider";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">

//       <body className={inter.className}>
//         <AuthProvider>
//           <Navbar />
//           {children}
//           <Footer />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

// layout.js
// "use client"; // Add this line to make the component a client component
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Navbar from "./components/Navbar";
// import '@fontsource/ibm-plex-sans-thai';
// import Footer from "./components/Footer";
// import { AuthProvider } from "./Provider";
// import FontSizeChanger from "./components/FontSizeChanger"; // Import the FontSizeChanger
// import { useState } from 'react'; // Import useState

// const inter = Inter({ subsets: ["latin"] });

// // export const metadata = {
// //   title: "Create Next App",
// //   description: "Generated by create next app",
// // };

// export default function RootLayout({ children }) {
//   const [fontSize, setFontSize] = useState(16); // Manage font size state

//   const increaseFontSize = () => {
//     setFontSize((prevSize) => prevSize + 2);
//   };

//   const decreaseFontSize = () => {
//     setFontSize((prevSize) => Math.max(prevSize - 2, 10)); // Minimum font size 10px
//   };

//   const resetFontSize = () => {
//     setFontSize(16); // Reset to default size
//   };

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <div style={{ fontSize: `${fontSize}px` }}> {/* Apply font size */}
//           <AuthProvider>
//             <Navbar />
//             <FontSizeChanger
//               increaseFontSize={increaseFontSize}
//               decreaseFontSize={decreaseFontSize}
//               resetFontSize={resetFontSize}
//             />
//             {children}
//             <Footer />
//           </AuthProvider>
//         </div>
//       </body>
//     </html>
//   );
// }


// app/layout.js
"use client"; // Ensure this is a client component
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import '@fontsource/ibm-plex-sans-thai';
import { AuthProvider } from "./Provider";
import { useState } from 'react'; // Import useState

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  const [fontSize, setFontSize] = useState('normal-font'); // Manage font size state
  // const [bgColor, setBgColor] = useState('bg-white'); // Manage background color state
  const [bgColor, setBgColor] = useState('bg-[#F4F6FA] text-black'); // Define bgColor state
  const [bgColorNavbar , setBgColorNavbar] = useState('bg-[#F97201]'); // Define bgColor state

  // const [bgColor, setBgColor] = useState('bg-[#F97201]'); // Default background color
  console.log('bgColorNavbar',bgColorNavbar);
  console.log('bgColor',bgColor);

  return (
    <html lang="en">
      <body className={`${fontSize}  ${bgColor} ${inter.className}`}> {/* Apply font size to body */}
        <div>
          
        </div>
        <AuthProvider>
          {/* <Navbar setFontSize={setFontSize} setBgColor={setBgColor}/> Pass setFontSize to Navbar */}
          {/* <Navbar setFontSize={setFontSize} setBgColor={setBgColor} fontSize={fontSize} /> Pass fontSize to Navbar */}
          <Navbar 
            setFontSize={setFontSize} 
            setBgColor={setBgColor} 
            setBgColorNavbar={setBgColorNavbar}
            fontSize={fontSize} 
            bgColor={bgColor}
            bgColorNavbar={bgColorNavbar} // Pass bgColor to Navbar
          />
          <div className={fontSize}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
