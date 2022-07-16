import type { Post } from '../interface';
/**
 * 根据权重和最后更新时间排序
 * @param latestFirst true：日期越近，则排在越前
 */
export declare const sortUnderWeightAndDate: (posts: Post[], latestFirst?: boolean) => Post[];
