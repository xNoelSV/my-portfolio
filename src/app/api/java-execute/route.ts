import { spawn } from "child_process";
import { writeFileSync, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

function getJavaPath(): string {
  // Try common Java installation paths on Windows
  const possiblePaths = [
    process.env.JAVA_HOME
      ? join(process.env.JAVA_HOME, "bin", "javac.exe")
      : null,
    "C:\\Program Files\\Java\\jdk*\\bin\\javac.exe",
    "C:\\Program Files (x86)\\Java\\jdk*\\bin\\javac.exe",
  ].filter(Boolean);

  // If JAVA_HOME is set, use it
  if (process.env.JAVA_HOME) {
    return join(process.env.JAVA_HOME, "bin", "javac");
  }

  // Otherwise assume javac is in PATH
  return "javac";
}

function executeCommand(
  command: string,
  args: string[],
  input?: string,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      timeout: 10000,
      shell: true, // Enable shell to find commands in PATH on Windows
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
      stderr = error.message;
      resolve({ stdout, stderr });
    });

    if (input) {
      proc.stdin?.write(input);
    }
    proc.stdin?.end();
  });
}

export async function POST(request: Request) {
  try {
    const { code, input } = await request.json();

    // Get Java path
    const javacPath = getJavaPath();
    const javaPath = javacPath.replace(/javac(\.exe)?$/, "java$1");

    // Create temporary directory with fallback for read-only environments
    let tmpDir: string;
    try {
      tmpDir = mkdtempSync(join(tmpdir(), "java-exec-"));
    } catch (error) {
      // Fallback for mobile/read-only environments
      tmpDir = join(
        "/tmp",
        `java-exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      );
    }

    try {
      // Save file
      const javaFile = join(tmpDir, "Main.java");
      writeFileSync(javaFile, code);

      // Compile
      const compileResult = await executeCommand(javacPath, [javaFile]);

      if (compileResult.stderr || compileResult.stdout.includes("error")) {
        return Response.json(
          {
            status: "error",
            stdout: "",
            stderr:
              compileResult.stderr ||
              compileResult.stdout ||
              "Java compiler not found. Please ensure Java JDK is installed and JAVA_HOME is set.",
          },
          { status: 400 },
        );
      }

      // Execute
      const runResult = await executeCommand(
        javaPath,
        ["-cp", tmpDir, "Main"],
        input,
      );

      return Response.json({
        status: "success",
        stdout: runResult.stdout,
        stderr: runResult.stderr,
      });
    } finally {
      // Clean up
      try {
        rmSync(tmpDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors on read-only systems
      }
    }
  } catch (error) {
    return Response.json(
      {
        status: "error",
        stdout: "",
        stderr:
          String(error) +
          ". Make sure Java JDK is installed. Set JAVA_HOME environment variable if needed.",
      },
      { status: 500 },
    );
  }
}
