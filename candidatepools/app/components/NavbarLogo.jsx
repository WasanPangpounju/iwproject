import React from 'react'
import Image from 'next/image'

function NavbarLogo() {
    return (
        <div className='relative gap-1 flex justify-end py-4 px-5 border-b-8  border-[#75C7C2]'>
            <Image priority alt="icon" className='w-auto h-14' src="/image/main/eee.png" height={1000} width={1000} />
            <Image priority alt="icon" className='w-auto h-14' src="/image/main/iw.png" height={1000} width={1000} />
            <Image priority alt="icon" className='w-auto h-14' src="/image/main/sss.png" height={1000} width={1000} />
            <div className="-z-10 bg-orange-200 w-10 h-14 rounded-tl-full absolute bottom-0 right-0"></div>
        </div>
    )
}

export default NavbarLogo
