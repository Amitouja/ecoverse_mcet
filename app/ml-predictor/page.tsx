"use client";

import MLPredictor from "./components/MLPredictor";
import Navigation from "./components/Navigation";

export default function MLPredictorPage() {
  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <Navigation />
      <MLPredictor />
    </div>
  );
}
