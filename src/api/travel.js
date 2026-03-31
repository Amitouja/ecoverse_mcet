import { supabase } from "../supabaseClient.js";

export async function calculateTravelImpact(distance, transport) {
  let factor = 0.12;

  if (transport === "car") factor = 0.21;
  if (transport === "bus") factor = 0.10;
  if (transport === "train") factor = 0.05;

  const carbon = distance * factor;

  const { data, error } = await supabase
    .from("footprints")
    .insert([
      {
        type: "travel",
        carbon_footprint: carbon,
      },
    ]);

  if (error) {
    console.error(error);
    return null;
  }

  return {
    carbonFootprint: carbon,
    equivalentTrees: Math.ceil(carbon / 20),
  };
}
