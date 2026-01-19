export const runtime = "nodejs";

// Try multiple free compiler APIs with fallback
async function executeWithCompilerAPI(
  code: string,
  input?: string,
): Promise<{ stdout: string; stderr: string }> {
  // Code is already wrapped with Main class from the frontend
  const wrappedCode = code;

  // Try Piston API first (using fetch for better compatibility)
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: "java",
        version: "*",
        files: [{ name: "Main.java", content: wrappedCode }],
        stdin: input || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Piston API returned ${response.status}`);
    }

    const result = await response.json();
    const stdout = (result.run?.output || result.compile?.output || "").trim();
    const stderr = (result.compile?.stderr || result.run?.stderr || "").trim();

    return { stdout, stderr };
  } catch (pistonError) {
    console.error("Piston API failed:", pistonError);

    // Fallback to Wandbox API (another free option)
    try {
      const response = await fetch("https://wandbox.org/api/compile.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          compiler: "openjdk-head",
          code: wrappedCode,
          stdin: input || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Wandbox API returned ${response.status}`);
      }

      const result = await response.json();
      return {
        stdout: (result.program_output || "").trim(),
        stderr: (result.program_error || result.compiler_error || "").trim(),
      };
    } catch (wandboxError) {
      console.error("Wandbox API failed:", wandboxError);
      throw new Error(
        `All compiler APIs failed. Piston: ${pistonError}, Wandbox: ${wandboxError}`,
      );
    }
  }
}

export async function POST(request: Request) {
  try {
    const { code, input } = await request.json();

    const result = await executeWithCompilerAPI(code, input);
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
        stderr: `Unable to execute code: ${String(error)}. Please check your internet connection.`,
      },
      { status: 500 },
    );
  }
}
