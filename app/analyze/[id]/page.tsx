import { createClient } from "@/utils/supabase/server";
import React from "react";
import Sections from "./sections";

const Analyze = async ({ params }: { params: { id: string } }) => {
  // fetch file from supabase
  const supabase = createClient();

  const { data, error } = await supabase.storage.from("images").list("", {
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  // match id with file name
  const file = data?.find((file) => file.name.split(".")[0] === params.id);

  if (!file) {
    return (
      <div className="w-full max-w-7xl py-28 fr mx-auto h-screen overflow-hidden gap-7">
        File not found
      </div>
    );
  }
  console.log(file);

  // create signed url
  const { data: signedURL, error: signedURLError } = await supabase.storage
    .from("images")
    .createSignedUrl(file.name, 60);

  if (signedURLError) {
    console.error(signedURLError);
    return <div>error</div>;
  }

  const url = signedURL?.signedUrl;

  // fetch initial messages
  const { data: messages, error: messagesError } = await supabase
    .from("chats")
    .select("*")
    .eq("id", params.id);

  console.log(messages);

  if (messagesError) {
    console.error(messagesError);
    return <div>error</div>;
  }

  return (
    <main className="w-full max-w-7xl py-28 fr mx-auto h-screen overflow-hidden gap-7">
      <Sections id={params.id} url={url} initialMessages={messages} />
    </main>
  );
};

export default Analyze;
