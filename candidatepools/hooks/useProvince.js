import { useEffect, useState } from "react";
import axios from "axios";

export function useProvince() {
  const [dataProvince, setDataProvince] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/provinces`);
        setDataProvince(res.data);
        
      } catch (err) {
        console.error("Error fetching province:", err);
      }
    };

    fetchData();
  }, []);

  return { dataProvince };
}
