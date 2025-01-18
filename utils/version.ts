import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function getGitHash() {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
}

function updateVersion() {
  const pkgPath = path.resolve(rootDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  const buildInfo = {
    version: pkg.version,
    buildTime: new Date().toISOString(),
    gitHash: getGitHash(),
    mode: process.env.MODE || "production",
  };

  // 讀取現有的 .env 文件
  const envPath = path.resolve(rootDir, ".env");
  let existingEnv = "";
  try {
    existingEnv = fs.readFileSync(envPath, "utf-8");
  } catch {
    // 如果文件不存在，使用空字串
  }

  // 將現有內容分行並過濾掉舊的版本相關設定
  const envLines = existingEnv
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("NEXT_PUBLIC_APP_VERSION") &&
        !line.startsWith("NEXT_PUBLIC_BUILD_TIME") &&
        !line.startsWith("NEXT_PUBLIC_GIT_HASH") &&
        !line.startsWith("NEXT_PUBLIC_MODE"),
    );

  // 添加新的版本信息
  const newEnvContent = [
    ...envLines,
    `NEXT_PUBLIC_APP_VERSION=${buildInfo.version}`,
    `NEXT_PUBLIC_BUILD_TIME=${buildInfo.buildTime}`,
    `NEXT_PUBLIC_GIT_HASH=${buildInfo.gitHash}`,
    `NEXT_PUBLIC_MODE=${buildInfo.mode}`,
  ]
    .filter(Boolean)
    .join("\n");

  // 寫入更新後的內容
  fs.writeFileSync(envPath, newEnvContent);

  // 更新 buildInfo.json
  const publicDir = path.resolve(rootDir, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(publicDir, "buildInfo.json"),
    JSON.stringify(buildInfo, null, 2),
  );

  console.log("Version info updated:", buildInfo);
}

updateVersion();
