import { spawn } from "child_process";
import { writeFileSync, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// Piston API - Single, reliable, free execution engine
async function executeWithPiston(
  code: string,
  input?: string,
): Promise<{ stdout: string; stderr: string }> {
  const wrappedCode = code.includes("class Main")
    ? code
    : `public class Main {\n${code}\n}`;

  const response = await fetch("https://api.piston.codes/v1/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "java",
      version: "*",
      files: [{ name: "Main.java", content: wrappedCode }],
      stdin: input || "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Piston API error: ${response.status}`);
  }

  const result = await response.json();
  const stdout = (result.run?.output || result.compile?.output || "").trim();
  const stderr = (result.compile?.stderr || result.run?.stderr || "").trim();

  return { stdout, stderr };
}

function executeCommand(
  command: string,
  args: string[],
  input?: string,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      timeout: 10000,
      shell: true,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", () => {
      resolve({ stdout, stderr });
    });

    proc.on("error", (error) => {
      resolve({ stdout, stderr: error.message });
    });

    if (input) {
      proc.stdin?.write(input);
    }
    proc.stdin?.end();
  });
}

function isJavaAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn("javac", ["-version"], {
      timeout: 5000,
      shell: true,
    });

    proc.on("error", () => resolve(false));
    proc.on("close", (code) => resolve(code === 0));
    setTimeout(() => resolve(false), 5000);
  });
}

export async function POST(request: Request) {
  try {
    const { code, input } = await request.json();

    // Try local Java first
    if (await isJavaAvailable()) {
      let tmpDir: string;
      try {
        tmpDir = mkdtempSync(join(tmpdir(), "java-exec-"));
      } catch {
        tmpDir = join(tmpdir(), `java-exec-${Date.now()}`);
      }

      try {
        const javaFile = join(tmpDir, "Main.java");
        writeFileSync(javaFile, code);

        const compileResult = await executeCommand("javac", [javaFile]);
        if (compileResult.stderr && !compileResult.stderr.includes("warning")) {
          // Compilation error, fall back to Piston
          const result = await executeWithPiston(code, input);
          return Response.json({
            status: result.stderr ? "error" : "success",
            stdout: result.stdout,
            stderr: result.stderr,
          });
        }

        const runResult = await executeCommand(
          "java",
          ["-cp", tmpDir, "Main"],
          input,
        );
        return Response.json({
          status: "success",
          stdout: runResult.stdout,
          stderr: runResult.stderr,
        });
      } finally {
        try {
          rmSync(tmpDir, { recursive: true, force: true });
        } catch {
          // ignore
        }
      }
    }

    // Use Piston API in production or when Java not available
    const result = await executeWithPiston(code, input);
    return Response.json({
      status: result.stderr ? "error" : "success",
      stdout: result.stdout,
      stderr: result.stderr,
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        stdout: "",
        stderr: `Error: ${String(error)}`,
      },
      { status: 500 },
    );
  }
}
