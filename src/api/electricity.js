import { supabase } from "../supabaseClient.js";

export async function calculateElectricityImpact(monthlyUsage) {
  const carbon = monthlyUsage * 0.82;

  const { data, error } = await supabase
    .from("footprints")
    .insert([
      {
        type: "electricity",
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
