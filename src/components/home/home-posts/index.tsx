import CategoriesTopic from './categories-topic';
import Posts from './posts';

export default function HomePosts() {
    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-5">
            <Posts />

            <CategoriesTopic />
        </div>
    );
}
