import { Category, IImageNameMap, Index } from "./type";
import { join } from "path";
import { access, writeFile } from "fs/promises";
import { constants } from "fs";

export function caclImageName(category: Category, index: Index) {
  return `${category}_${index+1}`;
}

async function findImage(dir: string, name: string) {
  const extensions = ["png"];
  let path = "";
  for (const extension of extensions) {
    path = join(dir, `${name}.${extension}`);
    try {
      await access(path, constants.R_OK);
      break;
    } catch (ignored) {
      continue;
    }
  }
  return path;
}

const categoryStack = [
  Category.background,
  Category.behindHair,
  Category.base,
  Category.ear,
  Category.facialExpression,
  Category.wear,
  Category.frontHair,
  Category.faceWear,
  Category.animalEars,
  Category.headWear
];

type NameStack = (undefined | string)[]

function toNameStack(names: IImageNameMap): NameStack {
  return[
    names.background,
    names.behindHair,
    names.base,
    names.ear,
    names.facialExpression,
    names.wear,
    names.frontHair,
    names.faceWear,
    names.animalEars,
    names.headWear
  ];
}

function toPathStack(inputDir: string, names: IImageNameMap): string[];
function toPathStack(inputDir: string, nameStack: NameStack): string[];
function toPathStack(inputDir: string, namesOrNameStack: IImageNameMap | NameStack): string[] {
  const isNameStack = (namesOrNameStack as NameStack)[0] != undefined || typeof (namesOrNameStack as NameStack).length === 'number';
  const nameStack = isNameStack ? namesOrNameStack as NameStack : toNameStack(namesOrNameStack as IImageNameMap);
    return categoryStack.map((value, index) => {
      const name = nameStack[index];
      if (!name) return;
      return join(inputDir, value, `${name}.png`);
    }).filter(v => !!v) as string[];
}

export async function getAvatarFiles(
  inputDir: string,
  names: IImageNameMap
): Promise<string[]> {
  const files = [] as string[];
  const pathStack = toPathStack(inputDir, names);
  for (let i = 0; i < pathStack.length; i++) {
    const path = pathStack[i];
    if (!path) throw new Error(`Path "${path}" can't be found.`);
  }
  pathStack.reduce((files, value) => {
    files.push(value);
    return files;
  }, files);
  return files
}