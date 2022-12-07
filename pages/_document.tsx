import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="bg-[#050505] text-[#f5f5f5] antialiased">
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
