import { getCategories, getTags } from '@/ultils/data-fn';
import FilterWarper from './filter-warper';

export default async function FilterSession() {
    const tags = await getTags();
    const categories = await getCategories();

    return <FilterWarper categories={categories} tags={tags} />;
}
