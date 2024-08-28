import React from 'react'
import Link from 'next/link'

function Footer() {
  return (
    <div className="  mt-14 mb-3 text-center">
      <p className="font-bold text-xs">สงวนลิขสิทธิ์ © 2567 Social Innovation Foundation (SIF)|
        <Link href="#">เงื่อนไขข้อตกลงการใช้บริการ</Link>|
        <Link href="#">นโยบายความเป็นส่วนตัว</Link>|
        <Link href="#">นโยบายคุกกี้</Link>|
        <Link href="#">ข้อจำกัดความรับผิดชอบ</Link>
      </p>
    </div>
  )
}

export default Footer
