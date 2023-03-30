import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

export async function snap(
  mode: "COPY_LINK" | "COPY_IMAGE" | "DOWNLOAD_IMAGE"
): Promise<void> {
  const editorDiv = document.getElementById("screenshot");

  if (!editorDiv) {
    return;
  }

  if (mode === "COPY_LINK") {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    } else {
      throw new Error("Clipboard API not supported");
    }

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

    return fetch(dataUrl)
      .then((response) => response.blob())
      .then(async (blob) => {
        if (mode === "DOWNLOAD_IMAGE") {
          saveAs(blob, "code-snippet.png");
        } else if (mode === "COPY_IMAGE") {
          if (navigator.clipboard && navigator.clipboard.write) {
            const item = new ClipboardItem({ "image/png": blob });

            await navigator.clipboard.write([item]);
          } else {
            throw new Error("Clipboard API not supported");
          }
        }
      });
  } catch (e) {
    throw new Error("Something went wrong");
  }
}
