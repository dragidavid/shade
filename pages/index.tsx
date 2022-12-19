import Code from "components/Code";
import Settings from "components/Settings";

export default function Home() {
  return (
    <main
      id="main"
      className="flex min-h-full flex-col items-center justify-center"
    >
      <Code />

      <Settings />
    </main>
  );
}
