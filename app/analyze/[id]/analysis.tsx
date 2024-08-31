"use client";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { AnalysisType } from "./sections";

interface AnalysisProps {
  image: string;
  id: string;
  analysis: AnalysisType;
  setAnalysis: (analysis: AnalysisType) => void;
}

const Analysis = ({ image, id, setAnalysis, analysis }: AnalysisProps) => {
  // loading state
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  const handleAnalysis = async () => {
    setLoading(true);
    const startTime = new Date().getTime();
    const response = await fetch("http://127.0.0.1:5000/predict?id=" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const endTime = new Date().getTime(); // Capture end time
    const duration = (endTime - startTime) / 1000; // Calculate time taken in seconds
    setTimeTaken(duration);

    const data = await response.json();
    console.log(data);

    // supabase
    // const {data: saveAnalysis, error} = await supabase
    //   .from('chats')
    //   .upda([
    //     {
    //       id,
    //       class: data.class,
    //       probability: data.probability,
    //       time_taken: duration
    //     }
    //   ]);

    setLoading(false);
    setAnalysis(data);
  };
  return (
    <div className="h-full fc gap-10 justify-start">
      <Image
        src={image}
        alt="analysis"
        width={1000}
        height={500}
        className="h-[50%] w-auto rounded-lg"
      />
      <AnimatePresence>
        {!analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="analysis"
          >
            <Button
              onClick={handleAnalysis}
              disabled={loading}
              className="mt-4"
            >
              Start Analysis
            </Button>
          </motion.div>
        )}
        {loading && <p>loading...</p>}
        {analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full px-3 py-4 bg-zinc-700 rounded-lg text-white"
          >
            <h2>Analysis</h2>
            <p className="text-2xl">Class: {analysis.class}</p>
            {/* probability is a whole number, round 2 decimals */}
            <p className="text-2xl">
              Probability: {Number(analysis.probability).toFixed(2)}%
            </p>
            <p className="text-lg">Time taken: {timeTaken} seconds</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analysis;
