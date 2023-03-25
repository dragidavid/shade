import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

export async function snap(mode: "DOWNLOAD" | "COPY"): Promise<void> {
  const editorDiv = document.getElementById("screenshot");

  if (!editorDiv) {
    return;
  }

  try {
    const options = {
      width: editorDiv.clientWidth * 2,
      height: editorDiv.clientHeight * 2,
      style: {
        maxWidth: "none",
        maxHeight: "none",
        transform: "scale(2)",
        transformOrigin: "top left",
      },
    };

    const dataUrl = await domtoimage.toPng(editorDiv, options);

    fetch(dataUrl)
      .then((response) => response.blob())
      .then(async (blob) => {
        if (mode === "DOWNLOAD") {
          saveAs(blob, "code-snippet.png");
        } else {
          if (navigator.clipboard && navigator.clipboard.write) {
            const item = new ClipboardItem({ "image/png": blob });

            await navigator.clipboard.write([item]);
          } else {
            console.error("clipboard not supported");
          }
        }
      });
  } catch (err) {
    console.error("something broke obviously", err);
  }
}
