import { useEffect, useState } from "react";
import axios from "axios";

export function useProvince(region_id) {
  const [dataProvince, setDataProvince] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/provinces?region_id=${region_id}`;
        const res = await axios.get(url);
        setDataProvince(res.data);
      } catch (err) {
        console.error("Error fetching province:", err);
      }
    };
    fetchData();
  }, [region_id]);

  return { dataProvince };
}
