import Code from "components/Code";
import Settings from "components/Settings";
import Dashboard from "components/Dashboard";

import CodeBackup from "components/CodeBackup";

import { exists } from "lib/exists";
import { getSession } from "lib/auth";

import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";

interface HomePageProps {
  s: Session;
}

export default function HomePage({ s }: HomePageProps) {
  /**
   * If the user is authenticated, show the `Dashboard` component.
   * In this "mode" the user can do CRUD operations on their snippets.
   *
   * When the user clicks `New`, the site will redirect to a new page with a new `id` in the URL.
   */
  if (exists(s)) {
    return <Dashboard />;
  }

  /**
   * If the user is not authenticated, just show a the `Code` and `Settings` components.
   * In this "mode" the user can't save any snippets in the database. They can only share it as a screenshot.
   */
  return (
    <>
      <CodeBackup />

      <Settings />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context.req, context.res);

  return {
    props: {
      s: session,
    },
  };
}
