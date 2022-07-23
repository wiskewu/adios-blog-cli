import R from 'ramda';
import { Dayjs } from 'dayjs';
import type { Post } from '../interface';

/**
 * 根据权重和最后更新时间排序
 * @param latestFirst true：最后更新日期越接近当前，则排在越前
 */
export const sortUnderWeightAndDate = (posts: Post[], latestFirst: boolean = true) => {
    const weightedPosts: Post[] = [];
    const unWeightedPosts: Post[] = [];
    // 优先考虑更新时间 
    const getDate = (createAt: Dayjs, updateAt: Dayjs) => {
        return updateAt?.isValid() ? updateAt : createAt?.isValid() ? createAt : new Dayjs();
    };

    R.forEach((post) => {
        if (post.descriptor.top) {
            weightedPosts.push(post);
        } else {
            unWeightedPosts.push(post);
        }
    }, posts);

    const dateSorter = (a: Post, b: Post) => {
        const aDate = getDate(a.descriptor.createDate, a.descriptor.updateDate);
        const bDate = getDate(b.descriptor.createDate, b.descriptor.updateDate);
        if (aDate.isSame(bDate)) return 0;
        if (latestFirst) {
            return aDate.isBefore(bDate) ? 1 : -1;
        }
        return aDate.isAfter(bDate) ? 1 : -1;
    };
    return R.concat(
        R.sort(dateSorter, weightedPosts),
        R.sort(dateSorter, unWeightedPosts)
    );
}