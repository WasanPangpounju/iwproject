"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// component
import PersonalForm from "@/app/components/Form/PersonalForm";

// store
import { useUserStore } from "@/stores/useUserStore";

function Page() {
  const { id } = useParams();
  const { getUserById } = useUserStore();

  const [dataUser, setDataUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(id);
      setDataUser(user);
    };
    
    if (id) {
      fetchUser();
    }
  }, [id, getUserById]);

  return (
    <div className="mt-5">
      {dataUser && <PersonalForm dataUser={dataUser} />}
    </div>
  );
}

export default Page;
