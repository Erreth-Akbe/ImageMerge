import { Category } from "./type";
import type { Index, _CategoryKeys, IImageNameMap } from "./type";
import { caclImageName } from "./file";

let _categoryWeight = [0, 100, 50, 25];
let _weightCount = _categoryWeight.reduce(
  (count, element) => count + element,
  0
);
_categoryWeight = _categoryWeight.map((e) => e / _weightCount);
let _imageWeight = [0, 100, 20, 1];
_weightCount = _imageWeight.reduce((count, element) => count + element, 0);
_imageWeight = _imageWeight.map((e) => e / _weightCount);

interface ICategoryLottery {
  // Query whether this part should be included
  queryIncluded(): boolean;
  // Query which child image should be used.
  queryImageIndex(): Index;
}

interface ICategoryWeights extends ICategoryLottery {
  name: _CategoryKeys | "base";
  weightIndex: number;
  childrenWeightIndexList: number[];
  childrenNameBase: string;
}

interface IImageFactory {
  // The partial images names which can build up a final image.
  images: IImageNameMap;
  getBatch(num: number): IImageNameMap[];
}

class CategoryWeights implements ICategoryWeights {
  name: _CategoryKeys ;
  weightIndex: number;
  childrenWeightIndexList: number[];
  childrenNameBase: string;

  private childrenWeights: number[];
  private accumulativeChildrenWeightList: number[];

  constructor(
    name: _CategoryKeys,
    weightIndex: number,
    childrenWeightIndexList: number[],
    childrenNameBase?: string
  ) {
    this.name = name;
    this.weightIndex = weightIndex;
    this.childrenWeightIndexList = childrenWeightIndexList;
    this.childrenNameBase = childrenNameBase ?? name;
    const childrenWeightsCount = childrenWeightIndexList.reduce(
      (count, element) => count + element,
      0
    );
    this.childrenWeights = childrenWeightIndexList.map(
      (e) => e / childrenWeightsCount
    );
    let count = 0;
    this.accumulativeChildrenWeightList = this.childrenWeights.map((e) => {
      count += e;
      return count;
    });
  }

  queryIncluded(): boolean {
    if (this.weightIndex === 0) return true;
    const random = Math.random();
    const weight = _categoryWeight[this.weightIndex];
    return random <= weight;
  }

  queryImageIndex(): Index {
    const random = Math.random();
    const index = this.accumulativeChildrenWeightList.findIndex(
      (e) => e > random
    );
    return index;
  }
}
const weights = [
  new CategoryWeights("headWear", 3, [3, 2, 3, 1, 2, 2, 2, 2]),
  new CategoryWeights("animalEars", 2, [2, 1, 3, 1, 2, 3]),
  new CategoryWeights(
    "faceWear",
    2,
    [3, 3, 3, 2, 3, 2, 3, 3, 2, 2, 2, 3, 3, 2, 2, 3, 1, 1, 1, 3, 2, 2, 2]
  ),
  new CategoryWeights("frontHair", 0, [2,3,1,2,3,3,3,2,2,3,2,2,1,2,1]),
  new CategoryWeights("wear", 0, [1, 1, 1, 2, 2, 3, 2, 3, 3, 3, 3, 3, 1, 2]),
  new CategoryWeights("facialExpression", 0, [3, 2, 3, 3, 1, 2, 2]),
  new CategoryWeights("ear", 0, [2, 2]),
  new CategoryWeights("base", 0, [2, 2]),
  new CategoryWeights("behindHair", 0, [3, 1, 2, 2, 1, 3, 2]),
  new CategoryWeights("background", 2, [2, 2, 1, 3]),
] as ICategoryWeights[];

const NameToWeight = {} as { [key: string]: keyof IImageNameMap };

export class ImageFactory implements IImageFactory {
  get images(): IImageNameMap {
    const result = {} as IImageNameMap;
    for (let i = 1; i < weights.length; i++) {
      const category = weights[i];
      if (category.queryIncluded())
        result[category.name as _CategoryKeys] = caclImageName(
          Category[category.name as _CategoryKeys],
          category.queryImageIndex()
        );
    }
    return result;
  }

  getBatch(num: number): IImageNameMap[] {
    const result = [];
    for (let i = 0; i < num; i++) {
      result.push(this.images);
    }
    return result;
  }
}
