import { getHomeData } from '@/ultils/data-fn';
import CategoriesTopic from './categories-topic';
import Posts from './posts';

export default async function HomePosts() {
    const { histories_rank, likes_rank }: { likes_rank: IPost[]; histories_rank: IPost[] } = await getHomeData();

    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="order-2 md:order-1 md:col-span-8 flex flex-col gap-10 w-full">
                <Posts title="Bài viết nổi bật" data={histories_rank || []} />
                <Posts title="Thích nhiều nhất" data={likes_rank || []} />
            </div>

            <CategoriesTopic />
        </div>
    );
}
