import { config } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(currentDir, "../../../"); //path to workspace root

const envDirs = [
  path.join(workspaceRoot, "packages/infra"),
  path.join(workspaceRoot, "apps/web"),
  path.join(workspaceRoot, "apps/server"),
];

// Detect runtime mode - Determine if running in local development or deployment based on npm lifecycle events
function getAlchemyMode() {
  const lifecycleEvent = process.env.npm_lifecycle_event;
  const lifecycleScript = process.env.npm_lifecycle_script;

  if (lifecycleEvent === "dev" || lifecycleScript === "alchemy dev") {
    return "local";
  }

  if (lifecycleEvent === "deploy" || lifecycleScript === "alchemy deploy") {
    return "deploy";
  }

  return process.argv.includes("dev") ? "local" : "deploy";
}

// Load environment variables - Load appropriate .env file based on detected mode for each configured directory
function loadEnvForMode(mode: "local" | "deploy") {
  const envFileName = mode === "local" ? ".env.local" : ".env";

  for (const dir of envDirs) {
    const filePath = path.join(dir, envFileName);

    if (!existsSync(filePath)) {
      continue;
    }

    config({
      path: filePath,
      override: true,
    });
  }
}

const mode = getAlchemyMode();
loadEnvForMode(mode);

// Log mode and validate environment - Print detected mode and define utility to validate required environment variables
console.log(`[alchemy] env mode: ${mode}`);
console.log(
  `[alchemy] lifecycle event: ${process.env.npm_lifecycle_event ?? "unknown"}`,
);

export function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}
