// provinceData.js
import { useEffect, useState } from 'react';

const useProvinceData = () => {
  const [dataProvince, setDataProvince] = useState([]);

  const apiurl =
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json";

  // รับข้อมูลจังหวัด
  async function getDataProvince() {
    try {
      const res = await fetch(apiurl);

      if (!res.ok) {
        throw new Error("Fetch API failed.");
      }

      const data = await res.json();
      setDataProvince(data);
    } catch (err) {
      console.error("Error fetching province data:", err);
    }
  }

  useEffect(() => {
    getDataProvince();
  }, []);

  return dataProvince;
};

export default useProvinceData;
