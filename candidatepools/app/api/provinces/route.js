import fs from "fs/promises";
import path from "path";

// region_id mapping:
// 1 = เหนือ
// 2 = ตะวันออกเฉียงเหนือ
// 3 = กลาง
// 4 = ใต้
// 5 = ตะวันตก
// 6 = ตะวันออก

export async function GET(request) {
  try {
    const filePath = path.join(process.cwd(), "assets", "dataThailand.json");
    const rawData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(rawData);

    // Clean เขต prefix for amphure in กรุงเทพมหานคร
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
      return province;
    });

    // Get region_id from query params
    const url = request?.url ? new URL(request.url) : null;
    const regionIdParam = url?.searchParams.get("region_id");
    const regionId = regionIdParam && regionIdParam.trim() !== "" ? Number(regionIdParam) : null;

    // Filter by region_id if provided and valid
    let filteredData = cleanedData;
    if (regionId && [1,2,3,4,5,6].includes(regionId)) {
      filteredData = cleanedData.filter((province) => province.region_id === regionId);
    }

    filteredData.sort((a, b) =>
      a.name_th.localeCompare(b.name_th, "th", { sensitivity: "base" })
    );

    return new Response(JSON.stringify(filteredData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error loading dataThailand.json:", err);
    return new Response(
      JSON.stringify({ error: "Failed to load province data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}