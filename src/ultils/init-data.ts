import Constant from '@/constants';
import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { ConfigModel } from '@/models/configs';
import { UserModel } from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PostModel } from '@/models/post';
import { HistoryModel } from '@/models/history';
const categories = [
    {
        name: 'Công nghệ',
        description: 'Các bài viết về công nghệ mới nhất.',
        slug: 'cong-nghe',
    },
    {
        name: 'Sức khỏe',
        description: 'Thông tin về sức khỏe và làm đẹp.',
        slug: 'suc-khoe',
    },
    {
        name: 'Tài chính',
        description: 'Những bài viết về tài chính cá nhân, đầu tư.',
        slug: 'tai-chinh',
    },
    {
        name: 'Giải trí',
        description: 'Thông tin về các hoạt động giải trí, phim ảnh.',
        slug: 'giai-tri',
    },
];

export const initConfigs = async () => {
    try {
        await connectDB();

        const configs = Constant.initConfigsData;

        if (Array.isArray(configs)) {
            const updatePromises = configs.map(async (config) => {
                const { key, value } = config;

                const existingConfig = await ConfigModel.findOne({ key });

                if (existingConfig) {
                    return ConfigModel.findOneAndUpdate({ key }, { $set: { value } }, { new: true });
                } else {
                    return new ConfigModel({ key, value }).save();
                }
            });

            const result = await Promise.all(updatePromises);

            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: 'Dữ liệu phải là mảng các đối tượng' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
};

export const initCategories = async () => {
    try {
        await connectDB();

        if (Array.isArray(categories)) {
            const updatePromises = categories.map(async (category) => {
                const { name, description, slug } = category;

                const existingCategory = await CategoryModel.findOne({ slug });

                if (existingCategory) {
                    if (existingCategory.name !== name || existingCategory.description !== description) {
                        return CategoryModel.findOneAndUpdate({ slug }, { $set: { name, description } }, { new: true });
                    } else {
                        return existingCategory;
                    }
                } else {
                    return new CategoryModel({ name, description, slug }).save();
                }
            });

            const result = await Promise.all(updatePromises);

            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: 'Dữ liệu phải là mảng các đối tượng' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
};

export const initUsers = async () => {
    try {
        await connectDB();

        const adminUser = {
            username: 'admin',
            email: 'admin@gmail.com',
            fullname: 'Admin',
            password: 'admin1234',
            role: 'admin',
        };

        const existingUser = await UserModel.findOne({ email: adminUser.email });

        if (existingUser) {
            return NextResponse.json({ message: 'Người dùng admin đã tồn tại' });
        } else {
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);

            const newAdminUser = new UserModel({
                username: adminUser.username,
                email: adminUser.email,
                password: hashedPassword,
                role: adminUser.role,
                fullname: adminUser.fullname,
            });

            await newAdminUser.save();

            return NextResponse.json({ message: 'Tạo người dùng admin thành công' });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
};

export const initPosts = async () => {
    try {
        await connectDB();

        const adminUser = await UserModel.findOne({ username: 'admin' });

        if (!adminUser) {
            return NextResponse.json({ error: 'Không tìm thấy người dùng admin' }, { status: 404 });
        }

        const categories = await CategoryModel.find();

        if (categories.length === 0) {
            return NextResponse.json({ error: 'Không tìm thấy category nào' }, { status: 404 });
        }

        const posts = Array.from({ length: 20 }, (_, index) => {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            return {
                thumbnail: `https://example.com/thumbnail${index + 1}.jpg`,
                title: `Bài viết số ${index + 1}`,
                content: `Nội dung bài viết số ${index + 1}. Đây là nội dung chi tiết của bài viết. Chúng tôi sẽ chia sẻ nhiều điều thú vị trong bài viết này về ${
                    randomCategory.name
                }.`,
                preview_content: `Mô tả ngắn về bài viết số ${index + 1}, trong đó sẽ đề cập đến ${randomCategory.name} trong nội dung.`,
                user: adminUser._id,
                category: randomCategory._id,
                slug: `bai-viet-so-${index + 1}`,
            };
        });

        const savePromises = posts.map(async (post) => {
            const { title } = post;
            const existingPost = await PostModel.findOne({ title });

            if (existingPost) {
                return existingPost;
            } else {
                return new PostModel(post).save();
            }
        });

        const result = await Promise.all(savePromises);

        return NextResponse.json(result);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
};

export const addHistoryRows = async () => {
    try {
        const newHistory = [
            { ip_client: '192.168.1.1', post: '679a2e82feaa0316a3b0315f' },
            { ip_client: '192.168.1.2', post: '679a2e82feaa0316a3b0315d' },
            { ip_client: '192.168.1.3', post: '679a2e82feaa0316a3b0315d' },
        ];

        // Thêm dữ liệu vào bảng History
        const createdHistory = await HistoryModel.insertMany(newHistory);

        return { success: true, data: createdHistory };
    } catch (error) {
        console.error('Error adding history rows:', error);
        return { success: false, message: (error as Error).message };
    }
};
