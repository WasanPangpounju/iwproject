// hooks/useProvince.js
import { useEffect, useState } from "react";
import axios from "axios";

export function useProvince() {
  const [dataProvince, setDataProvince] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
        );
        const data = res.data;
        data.sort((a, b) =>
          a.name_th.localeCompare(b.name_th, "th", { sensitivity: "base" })
        );
        setDataProvince(data);
      } catch (err) {
        console.error("Error fetching province:", err);
      }
    };

    fetchData();
  }, []);

  return { dataProvince };
}
