import { describe, expect, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

/** The single source of truth for the inline theme script. */
const THEME_INIT_PATH = path.join(
  REPO_ROOT,
  "public",
  "html",
  "theme-init.html",
);

/** The two templates that must include the script verbatim. */
const TEMPLATE_PATHS = [
  path.join(REPO_ROOT, "server", "src", "views", "layout.tmpl"),
  path.join(REPO_ROOT, "packages", "server", "src", "templates", "layout.eta"),
] as const;

/** Extracts the `<script>` block from the shared theme-init file. */
function getSharedScriptBlock(): string {
  const content = readFileSync(THEME_INIT_PATH, "utf8");
  const start = content.indexOf("<script");
  const end = content.indexOf("</script>");
  if (start === -1 || end === -1) {
    throw new Error(
      `The "${THEME_INIT_PATH}" file does not contain a "<script>" block.`,
    );
  }

  return content.slice(start, end + "</script>".length);
}

describe("layout theme script", () => {
  const scriptBlock = getSharedScriptBlock();

  for (const templatePath of TEMPLATE_PATHS) {
    test(`"${path.relative(REPO_ROOT, templatePath)}" contains the shared theme script verbatim`, () => {
      const content = readFileSync(templatePath, "utf8");
      expect(content).toContain(scriptBlock);
    });
  }
});
