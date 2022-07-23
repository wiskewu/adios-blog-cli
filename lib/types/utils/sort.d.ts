import type { Post } from '../interface';
/**
 * 根据权重和最后更新时间排序
 * @param latestFirst true：最后更新日期越接近当前，则排在越前
 */
export declare const sortUnderWeightAndDate: (posts: Post[], latestFirst?: boolean) => Post[];
