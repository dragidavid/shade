import { redirect } from "next/navigation";

import Editor from "components/Editor";

import { getSession } from "lib/auth";

export default async function Page() {
  const session = await getSession();

  const signedIn = !!session;

  if (session) {
    redirect("/dashboard");
  }

  return <Editor editable={true} signedIn={signedIn} />;
}
