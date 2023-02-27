import Document, { Html, Head, Main, NextScript } from "next/document";

import { cn } from "lib/cn";

class MyDocument extends Document {
  render() {
    return (
      <Html
        lang="en"
        className={cn("bg-almost-black text-almost-white antialiased")}
      >
        <Head />
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
