import mergeImage from "merge-images";
import { Canvas, Image } from "canvas";
import { join } from "path";
import { writeFile } from "fs/promises";
import { getAvatarFiles } from "./file";
import { ImageFactory } from "./probability";
import { List, Set } from "immutable";

export async function batchMerge(
  inputDir: string,
  outputDir: string,
  num: number
) {
  const factory = new ImageFactory();
  const names = factory.getBatch(num);
  const _promises = names.map((value) => getAvatarFiles(inputDir, value));
  let paths = await Promise.all(_promises);
  paths = [...Set(paths.map(e => List(e)))].map(e => e.toArray());
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    let b64 = await mergeImage(path, { Canvas, Image });
    b64 = b64.replace(/^data:image\/png;base64,/, "");
    await writeFile(join(outputDir as string, `${i}.png`), b64, "base64");
  }
  return;
}

const input = join(__dirname, "input");
const output = join(__dirname, "output");
batchMerge(input, output, 1000);
