import { initCategories, initConfigs, initPosts, initUsers } from '@/ultils/init-data';
import { NextResponse } from 'next/server';

export async function POST() {
    const configs = await initConfigs();
    const categories = await initCategories();
    const users = await initUsers();

    const posts = await initPosts();

    return NextResponse.json({ categories, configs, users, posts });
}
