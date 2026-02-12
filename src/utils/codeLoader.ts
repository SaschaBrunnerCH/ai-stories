import fs from "node:fs/promises";
import path from "node:path";

export interface CodeFile {
  filename: string;
  code: string;
  language: string;
}

/**
 * Load code files associated with a markdown entry
 * Code files should be in the same directory with naming convention:
 * - Same base name: `git-rebase.md` + `git-rebase.sh`
 * - Multiple files with suffix: `eslint-setup_config.js`, `eslint-setup_example.ts`
 */
export async function loadCodeFiles(
  codeFiles?: string[],
  baseDir: string = "./content/ai-stories"
): Promise<CodeFile[]> {
  if (!codeFiles || codeFiles.length === 0) {
    return [];
  }

  const results = await Promise.all(
    codeFiles.map(async (filename) => {
      try {
        const filePath = path.resolve(path.join(baseDir, filename));
        const baseResolved = path.resolve(baseDir);
        if (!filePath.startsWith(baseResolved)) {
          console.warn(`Path traversal blocked: ${filename}`);
          return null;
        }
        const code = await fs.readFile(filePath, "utf-8");
        const ext = path.extname(filename).slice(1);
        const language = getLanguageFromExtension(ext);

        return { filename, code, language };
      } catch (error) {
        console.warn(`Failed to load code file: ${filename}`, error);
        return null;
      }
    })
  );

  return results.filter((result): result is CodeFile => result !== null);
}

/**
 * Map file extensions to language identifiers for syntax highlighting
 */
function getLanguageFromExtension(ext: string): string {
  const languageMap: Record<string, string> = {
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    ts: "typescript",
    tsx: "tsx",
    jsx: "jsx",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    ps1: "powershell",
    py: "python",
    rb: "ruby",
    go: "go",
    rs: "rust",
    java: "java",
    kt: "kotlin",
    swift: "swift",
    cs: "csharp",
    cpp: "cpp",
    c: "c",
    h: "c",
    hpp: "cpp",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    xml: "xml",
    html: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    md: "markdown",
    sql: "sql",
    graphql: "graphql",
    gql: "graphql",
    dockerfile: "dockerfile",
    makefile: "makefile",
    nginx: "nginx",
    ini: "ini",
    env: "bash",
  };

  return languageMap[ext.toLowerCase()] || ext;
}
