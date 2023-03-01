"use client";

import { createContext, useContext, useState } from "react";

import { createClient } from "lib/supabase/client";

import type { SupabaseClient, Session } from "@supabase/auth-helpers-nextjs";

// import type { Database } from '../lib/database.types'

type MaybeSession = Session | null;

type SupabaseContext = {
  // supabase: SupabaseClient<Database>
  supabase: SupabaseClient;
  session: MaybeSession;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: MaybeSession;
}) {
  const [supabase] = useState(() => createClient());

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  } else {
    return context;
  }
};
