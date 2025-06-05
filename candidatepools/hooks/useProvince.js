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
        const cleanedData = data.map((province) => {
          if (province.id === 1) {
            return {
              ...province,
              amphure: province.amphure.map((amphur) => ({
                ...amphur,
                name_th: amphur.name_th.startsWith("เขต")
                  ? amphur.name_th.replace(/^เขต/, "").trim()
                  : amphur.name_th,
              })),
            };
          }

          return province; // จังหวัดอื่นไม่แก้ไข
        });
        cleanedData.sort((a, b) =>
          a.name_th.localeCompare(b.name_th, "th", { sensitivity: "base" })
        );
        setDataProvince(cleanedData);
      } catch (err) {
        console.error("Error fetching province:", err);
      }
    };

    fetchData();
  }, []);

  return { dataProvince };
}
