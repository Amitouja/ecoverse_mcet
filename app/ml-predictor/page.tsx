"use client";

import MLPredictor from "@/app/components/MLPredictor";
import Navigation from "@/app/components/Navigation";

export default function MLPredictorPage() {
  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <Navigation />
      <MLPredictor />
    </div>
  );
}
