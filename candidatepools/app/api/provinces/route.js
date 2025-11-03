import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "assets", "dataThailand.json");

    const rawData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(rawData);

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

    cleanedData.sort((a, b) =>
      a.name_th.localeCompare(b.name_th, "th", { sensitivity: "base" })
    );

    return new Response(JSON.stringify(cleanedData), {
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