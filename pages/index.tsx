import Code from "components/Code";
import Settings from "components/Settings";
import Dashboard from "components/Dashboard";

import { getServerSession } from "lib/auth";
import { exists } from "lib/exists";

import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";

interface HomePageProps {
  s: Session;
}

export default function HomePage({ s }: HomePageProps) {
  if (exists(s)) {
    return <Dashboard />;
  }

  return (
    <>
      <Code />

      <Settings />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res);

  return {
    props: {
      s: session,
    },
  };
}
