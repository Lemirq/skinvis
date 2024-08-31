"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/file-upload";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const supabase = createClient();

  const handleFileUpload = async (files: File) => {
    console.log(files);
    // generate uuid with crypto
    const uuid = crypto.randomUUID();

    const promise = new Promise(async (resolve, reject) => {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`${uuid}.${files.name.split(".")[1]}`, files);
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(data);
      }
    });

    toast.promise(promise, {
      loading: "Uploading...",
      success: () => {
        router.push(`/analyze/${uuid}`);
        return `Image uploaded successfully`;
      },
      error: "Error uploading image",
    });
  };

  return (
    <section className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          Beta
        </span>
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          Detect Skin Cancer Early with SkinVis.ai
        </h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
          Early detection is key to treating skin cancer. SkinVis.ai uses AI to
          help you detect skin cancer early by analyzing your skin images.
        </p>

        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
