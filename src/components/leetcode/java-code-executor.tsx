"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Play } from "lucide-react";

interface TestCase {
  id: string;
  expectedOutput: string;
  call: string; // Java code executed in main
  params?: string; // parameter description
}

interface ExecutorResult {
  testId: string;
  status: "pending" | "running" | "success" | "error";
  output: string;
  error?: string;
}

export function JavaCodeExecutor({
  initialCode,
  testCases,
  className,
}: {
  initialCode: string;
  testCases: TestCase[];
  className?: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [selectedTest, setSelectedTest] = useState(testCases[0]?.id || "0");
  const [results, setResults] = useState<Map<string, ExecutorResult>>(
    new Map(),
  );
  const [isRunning, setIsRunning] = useState(false);

  const currentTest = testCases.find((t) => t.id === selectedTest);
  const currentResult = results.get(selectedTest);

  const runCode = async () => {
    setIsRunning(true);
    const newResults = new Map(results);

    for (const testCase of testCases) {
      newResults.set(testCase.id, {
        testId: testCase.id,
        status: "running",
        output: "",
      });
    }
    setResults(newResults);

    try {
      for (const testCase of testCases) {
        try {
          // Automatically add Main class
          const fullCode = `${code}

public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        ${testCase.call}
    }
}`;

          const response = await fetch("/api/java-execute", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: fullCode,
            }),
          });

          const data = await response.json();
          console.log("Execution result:", data);

          const output = data.stdout?.trim() || "";
          const error = data.stderr || "";

          newResults.set(testCase.id, {
            testId: testCase.id,
            status: error && !output ? "error" : "success",
            output: output || error || "(no output)",
            error: error,
          });
        } catch (error) {
          console.error("Execution error:", error);
          newResults.set(testCase.id, {
            testId: testCase.id,
            status: "error",
            output: "",
            error: "Error connecting to the server: " + String(error),
          });
        }
      }
    } finally {
      setIsRunning(false);
      setResults(newResults);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div
      className={`my-6 overflow-hidden border border-neutral-200 rounded-lg bg-white dark:border-neutral-800 dark:bg-neutral-950 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Java
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyCode}
            className="h-8 gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            size="sm"
            onClick={runCode}
            disabled={isRunning}
            className="h-8 gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex h-80">
        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-full w-full bg-neutral-950 p-4 font-mono text-sm text-neutral-50 placeholder-neutral-600 focus:outline-none resize-none"
            placeholder="// Enter your Java code here..."
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="grid md:grid-cols-[200px_1fr] grid-cols-[100px_1fr]">
          {/* Test Cases List */}
          <div className="border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
              Tests
            </div>
            <div className="overflow-y-auto">
              {testCases.map((testCase) => {
                const result = results.get(testCase.id);
                const isSelected = selectedTest === testCase.id;

                return (
                  <button
                    key={testCase.id}
                    onClick={() => setSelectedTest(testCase.id)}
                    className={`w-full border-b border-neutral-200 px-4 py-3 text-left text-sm transition-colors dark:border-neutral-800 ${
                      isSelected
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          !result
                            ? "bg-neutral-300 dark:bg-neutral-600"
                            : result.status === "error"
                              ? "bg-red-500"
                              : "bg-green-500"
                        }`}
                      />
                      <span className="font-mono">{testCase.id}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Output Panel */}
          <div className="overflow-hidden flex flex-col">
            {currentTest ? (
              <>
                {currentTest.params && (
                  <div className="border-b border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
                    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                      Input
                    </div>
                    <span className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 font-mono m-0">
                      {currentTest.params}
                    </span>
                  </div>
                )}
                <div className="border-b border-neutral-200 dark:border-neutral-800 flex flex-col">
                  <div className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                    Output{" "}
                    {currentResult && (
                      <span
                        className={
                          currentResult.status === "error"
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }
                      >
                        (
                        {currentResult.status === "error" ? "Error" : "Success"}
                        )
                      </span>
                    )}
                  </div>
                  <span className="border px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 font-mono whitespace-pre-wrap break-words m-0">
                    {currentResult?.output ||
                      (isRunning ? "Running..." : "(waiting for execution)")}
                  </span>
                </div>
                <div className="overflow-hidden flex flex-col">
                  <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                    Expected Output
                  </div>
                  <span className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 font-mono m-0">
                    {currentTest.expectedOutput}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-neutral-500 dark:text-neutral-400">
                No tests available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
