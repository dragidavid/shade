import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Highlight, { defaultProps } from "prism-react-renderer";

import theme from "prism-react-renderer/themes/nightOwl";

export default function Code() {
  const preRef = useRef<HTMLPreElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (containerRef.current && preRef.current && textAreaRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const preHeight = preRef.current.clientHeight;

      textAreaRef.current.style.height = `${Math.max(
        containerHeight,
        preHeight
      )}px`;
    }
  }, [containerRef.current?.clientHeight, preRef.current?.clientHeight]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  /**
   * 1. Have a custom theme and maybe some presets for the user to choose from
   * 2. Have a way for the user to customize their snippets.
   *  - Hide/Show line numbers
   *  - Adjust font size
   * 3. Possibly add a title to their snippet
   * 4. Hide/Show their name (github username)
   * 5. Ability to save the snippet longer than 24 hours which would be the default
   *
   * Have these settings saved along with the snippet in the database so that when the user
   * comes back to the snippet, it will be the same as they left it.
   *
   */

  // const theme = {
  //   plain: {
  //     color: "hsl(0, 0%, 9%)",
  //   },
  //   styles: [
  //     {
  //       types: ["comment"],
  //       style: {
  //         color: "hsl(0, 0%, 56.1%)",
  //       },
  //     },
  //     {
  //       types: ["atrule", "keyword", "attr-name", "selector"],
  //       style: {
  //         color: "hsl(0, 0%, 52.3%)",
  //       },
  //     },
  //     {
  //       types: ["punctuation", "operator"],
  //       style: {
  //         color: "hsl(0, 0%, 56.1%)",
  //       },
  //     },
  //     {
  //       types: ["class-name", "function", "tag"],
  //       style: {
  //         color: "hsl(0, 0%, 9%)",
  //       },
  //     },
  //   ],
  // };

  return (
    <div
      className={clsx(
        "h-2/3 w-2/3 max-w-4xl rounded-xl border-[1px] py-4",
        "transition-colors duration-300 ease-in-out",
        "border-white/20 focus-within:border-pink-400"
      )}
    >
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-auto transition-all duration-300 ease-in-out"
      >
        <Highlight {...defaultProps} theme={theme} code={value} language="jsx">
          {({ className, tokens, getLineProps, getTokenProps }) => (
            <>
              <textarea
                ref={textAreaRef}
                value={value}
                placeholder="Add some code here..."
                onChange={handleChange}
                spellCheck={false}
                className={clsx(
                  className,
                  "absolute w-full resize-none overflow-hidden whitespace-pre-wrap break-words break-keep bg-transparent pl-16 pr-3 font-mono text-transparent",
                  "caret-pink-500 selection:bg-pink-500/30 placeholder:text-white/20 focus:outline-none"
                )}
              />
              <pre
                ref={preRef}
                aria-hidden={true}
                className={clsx(
                  className,
                  "pointer-events-none absolute w-full select-none pr-3"
                )}
              >
                {tokens.map((line, i) => (
                  <div
                    key={i}
                    {...getLineProps({ line, key: i })}
                    className="table-row"
                  >
                    <span className="table-cell w-10 select-none text-right opacity-50">
                      {i + 1}
                    </span>
                    <code className="table-cell whitespace-pre-wrap break-words break-keep pl-6">
                      {line.map((token, key) => (
                        <span key={i} {...getTokenProps({ token, key })} />
                      ))}
                    </code>
                  </div>
                ))}
              </pre>
            </>
          )}
        </Highlight>
      </div>
    </div>
  );
}
