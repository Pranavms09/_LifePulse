module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { lat, lon, radius = 3000 } = req.query || {};

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    // Overpass API Query
    // We search for pharmacies, chemists, and medical supply stores
    // Overpass API Query
    // We search for pharmacies and medical shops
    const query = `[out:json][timeout:25];(node["amenity"="pharmacy"](around:${radius},${lat},${lon});way["amenity"="pharmacy"](around:${radius},${lat},${lon});node["shop"~"pharmacy|chemist|medical"](around:${radius},${lat},${lon});way["shop"~"pharmacy|chemist|medical"](around:${radius},${lat},${lon});node["name"~"medical|chemist",i](around:${radius},${lat},${lon}););out center;`;

    let response;
    try {
      response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (!response.ok) throw new Error("Primary server failed");
    } catch (e) {
      console.log("Primary Overpass server failed, trying fallback...");
      response = await fetch("https://overpass.kumi.systems/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("All Overpass API servers failed:", errorText);
      throw new Error(`Overpass API service unavailable (${response.status})`);
    }

    const data = await response.json();

    if (data.remark) {
      console.error("Overpass API Remark:", data.remark);
      // If it's just a warning/remark but we have elements, we might still proceed
      if (!data.elements) throw new Error(data.remark);
    }

    if (!data.elements) {
      console.error("Overpass API returned no elements field:", data);
      return res.status(200).json({ count: 0, pharmacies: [] });
    }

    // Process and simplify the data
    const pharmacies = data.elements
      .filter(
        (el) =>
          el.tags &&
          (el.tags.amenity === "pharmacy" ||
            el.tags.shop === "chemist" ||
            el.tags.shop === "medical_supply" ||
            (el.tags.name &&
              (el.tags.name.toLowerCase().includes("medical") ||
                el.tags.name.toLowerCase().includes("chemist")))),
      )
      .map((el) => ({
        id: el.id,
        name: el.tags.name || "Unnamed Medical Store",
        lat: el.lat || (el.center ? el.center.lat : null),
        lon: el.lon || (el.center ? el.center.lon : null),
        address:
          el.tags["addr:full"] ||
          el.tags["addr:street"] ||
          el.tags["addr:place"] ||
          "Address not available",
        opening_hours: el.tags.opening_hours || "Not available",
        phone: el.tags.phone || el.tags["contact:phone"] || "Not available",
        website: el.tags.website || "Not available",
      }))
      .filter((p) => p.lat !== null && p.lon !== null);

    return res.status(200).json({
      count: pharmacies.length,
      pharmacies: pharmacies,
    });
  } catch (error) {
    console.error("Error in nearby-pharmacies function:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch pharmacies", details: error.message });
  }
};
