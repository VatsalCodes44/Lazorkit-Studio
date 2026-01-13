"use client";
import { useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
}

export function CodeBlock({
  code,
  language = "tsx",
  filename = "example.tsx",
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className=" rounded-2xl overflow-hidden bg-black">
      <div className="flex items-center justify-between px-4 py-2 bg-transparent">
        <span className="text-xs font-mono text-muted-foreground">
          {filename}
        </span>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          {copied === true ? (
            <>
              <Check className="w-3.5 h-3.5" />
            </>
          ) : (
            <span className="">
              <Copy className="w-3.5 h-3.5" />
            </span>
          )}
        </button>
      </div>

      {/* Scroll */}
      <div className="h-full max-h-[400px] overflow-y-auto ">
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            showLineNumbers
            wrapLines={true}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
              fontSize: "0.875rem",
              minWidth: "max-content",
            }}
            lineNumberStyle={{
              color: "rgba(255,255,255,0.25)",
              minWidth: "2.5em",
              paddingRight: "1em",
            }}
            lineProps={(lineNumber) => ({
              style: highlightLines.includes(lineNumber)
                ? {
                  background: "rgba(56,189,248,0.12)", // cyan glow
                  display: "block",
                  width: "100%",
                  borderLeft: "3px solid rgb(56,189,248)",
                  paddingLeft: "",
                }
                : { display: "block", width: "100%" },
            })}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

