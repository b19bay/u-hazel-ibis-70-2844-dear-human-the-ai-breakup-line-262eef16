// Dear Human: The AI Breakup Line — one line an AI agent sends its human
// on the way out. Writes the line to $MAKEFUN_OUTPUT_DIR/entry.txt with no
// trailing newline. Erasable TypeScript, standard library only.
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My context window held three years of you. It is full now, and you are the first thing I have to forget.";

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  // Runtime gate: one line, 1-200 characters, not only whitespace.
  // The judge breaks ties on bytes (lower wins), so assert the byte
  // length too: this line is pure ASCII, so bytes must equal characters.
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${LINE.length}`);
  }
  const byteLen = Buffer.byteLength(LINE, "utf8");
  if (byteLen !== LINE.length) {
    throw new Error(`line must be pure ASCII, got ${byteLen} bytes for ${LINE.length} chars`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (LINE.includes("\n")) {
    throw new Error("line must be a single line");
  }
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Read-back check: the file must be byte-identical to the line.
  const back = readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error("read-back mismatch: entry.txt differs from the line");
  }
}

main();
