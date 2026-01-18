import { spawn } from "child_process";
import { writeFileSync, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// TIO.run free API (no API key needed, no rate limits)
async function executeWithTIO(
  code: string,
  input?: string,
): Promise<{ stdout: string; stderr: string }> {
  try {
    // Wrap code with proper class structure if needed
    const wrappedCode = code.includes("class Main")
      ? code
      : `public class Main {\n${code}\n}`;

    const payload = new URLSearchParams({
      lang: "java",
      code: wrappedCode,
      ...(input && { input: input }),
    });

    const response = await fetch("https://tio.run/cgi-bin/run/tiorun", {
      method: "POST",
      body: payload,
    });

    const text = await response.text();
    // TIO returns output, parse it
    return {
      stdout: text,
      stderr: "",
    };
  } catch (error) {
    return {
      stdout: "",
      stderr: `TIO.run execution failed: ${String(error)}`,
    };
  }
}

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

// Check if Java is available on the system
function isJavaAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const proc = spawn("javac", ["-version"], {
      timeout: 5000,
      shell: true,
    });

    proc.on("error", () => {
      resolve(false);
    });

    proc.on("close", (code) => {
      resolve(code === 0);
    });

    setTimeout(() => resolve(false), 5000);
  });
}

export async function POST(request: Request) {
  try {
    const { code, input } = await request.json();

    // Check if Java is available
    const javaAvailable = await isJavaAvailable();

    // If Java not available, use TIO.run directly
    if (!javaAvailable) {
      console.log("Java not found on system, using TIO.run...");
      const tioResult = await executeWithTIO(code, input);
      return Response.json({
        status: "success",
        stdout: tioResult.stdout,
        stderr: tioResult.stderr,
      });
    }

    // Get Java path for local execution
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
        // Try TIO if local compilation fails
        console.log("Local Java compilation failed, trying TIO.run...");
        const tioResult = await executeWithTIO(code, input);

        return Response.json({
          status: "success",
          stdout: tioResult.stdout,
          stderr: tioResult.stderr,
        });
      }

      // Execute locally
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
    } catch (localError) {
      // If local execution fails completely, use TIO.run
      console.log(
        "Local Java execution failed, using TIO.run:",
        String(localError),
      );
      const tioResult = await executeWithTIO(code, input);

      return Response.json({
        status: "success",
        stdout: tioResult.stdout,
        stderr: tioResult.stderr,
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
        stderr: String(error),
      },
      { status: 500 },
    );
  }
}
