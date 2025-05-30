import React from "react";
import Image from "next/image";

function Profile({ imageSrc, tailwind="w-32 h-32" }) {
  return (
    <div className={`${tailwind} shrink-0`}>
      <Image
        className={`${tailwind} cursor-pointer`}
        src={imageSrc || "/image/main/user.png"}
        height={1000}
        width={1000}
        alt="profile"
        priority
      />
    </div>
  );
}

export default Profile;
