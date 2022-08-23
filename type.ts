export enum Category {
  headWear = "01headwear",
  animalEars = "02animals' ears",
  faceWear = "03facewear",
  frontHair = "04front hair",
  wear = "05clothes",
  facialExpression = "06expression",
  ear = "07ear",
  base = "08base",
  behindHair = "09behind hair",
  background = "10background",
}

export type Index = number;

export type _CategoryKeys = keyof typeof Category;

type _IImageNameMap = Record<_CategoryKeys, string>;

// A map map the category to its correspond partial image name (without extension).
export type IImageNameMap = Partial<_IImageNameMap>;