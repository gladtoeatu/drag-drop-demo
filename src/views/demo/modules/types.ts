import type { GridStackWidget } from "gridstack";

/**
 * `物品` 接口定义
 */
export interface ISomeThing {
  id: number;
  type: SomeThingType;
  /** 物品尺寸 | 以俯视的角度定义的“宽”、“高”、“深” */
  size: ISomeThingSize;
  /** 物品方向 | 默认表示 `vertical` 纵向 */
  direction?: SomeThingDirection;
  description?: string;
}

/**
 * `物品` 类型定义
 */
export enum SomeThingType {
  柜子 = "Cabinet",
  板凳 = "Bench",
}

/**
 * `物品` 方向定义
 */
export enum SomeThingDirection {
  纵向 = "vertical",
  横向 = "horizontal",
}

/**
 * `物品` 尺寸
 */
export interface ISomeThingSize {
  width: number;
  height: number;
  /** 暂时没做“深度”的考虑 */
  depth?: number;
}

export interface MyGridStackWidget extends GridStackWidget {
  direction?: SomeThingDirection;
}
