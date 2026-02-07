
import React from "react";
import Image from "next/image";
import Skeleton from '@mui/material/Skeleton';


function Profile({ imageSrc, tailwind = "w-32 h-32", loading = false }) {
  return (
    <div className={`${tailwind} shrink-0`}>
      {loading ? (
        <Skeleton variant="rectangular" width={50} height={50} />
      ) : (
        <Image
          className={`${tailwind} cursor-pointer`}
          src={imageSrc || "/image/main/user.png"}
          height={1000}
          width={1000}
          alt="profile"
          priority
        />
      )}
    </div>
  );
}

export default Profile;
