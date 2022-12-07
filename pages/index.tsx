import Code from "components/Code";

export default function Home() {
  return (
    <main className="h-full flex items-center justify-center flex-col gap-6">
      <h1 className="text-4xl font-black">Hello</h1>
      <Code placeholder="Paste some code in here..." />
    </main>
  );
}
