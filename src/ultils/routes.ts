import { Box, Contact, Mail, Store } from 'lucide-react';

export default class Routes {
    public static HOME = '/';
    public static ABOUT = '/about';
    public static CONTACT = '/contact';
    public static POSTS = '/posts';
    public static ADMIN_CATEGORIES = '/admin/categories';
    public static ADMIN_MEDIAS = '/admin/medias';
    public static ADMIN_POSTS = '/admin/posts';
    public static ADMIN_CONFIGS = '/admin/configs';

    public static DASHBOARD = '/admin/dashboard';
    public static LOGIN = '/admin/login';

    public static GENERATE_CATEGORY_URL(category: ICategory) {
        return `${this.POSTS}/?category=${category.slug}`;
    }

    public static GENERATE_POST_URL(post: IPost) {
        return `${this.POSTS}/${post._id}/${post.slug}/${post.title.replaceAll(' ', '-')}`;
    }

    public static GENERATE_ADMIN_POST_URL(post: IPost) {
        return `/admin/${this.POSTS}/${post._id}`;
    }

    public static MENUS = [
        {
            icon: '',
            title: 'Trang chủ',
            link: this.HOME,
        },
        {
            icon: '',
            title: 'Bài viết',
            link: this.POSTS,
        },
        {
            icon: '',
            title: 'Về chúng tôi',
            link: this.ABOUT,
        },
        {
            icon: '',
            title: 'Liên hệ / Góp ý',
            link: this.CONTACT,
        },
    ];

    public static ADMIN_MENU = [
        {
            icon: '',
            title: 'Categories',
            link: this.ADMIN_CATEGORIES,
        },
        {
            icon: '',
            title: 'Medias',
            link: this.ADMIN_MEDIAS,
        },
        {
            icon: '',
            title: 'Posts',
            link: this.ADMIN_POSTS,
        },
        {
            icon: '',
            title: 'Configs',
            link: this.ADMIN_CONFIGS,
        },
    ];

    public static MENU_FOOTER = [
        {
            title: 'Về chúng tôi',
            icon: Store,
            data: this.MENUS,
        },
        {
            title: 'Sản phẩm',
            icon: Box,
            data: [
                {
                    icon: '',
                    title: 'Ktq ews',
                    link: this.HOME,
                },
            ],
        },
        {
            title: 'Dịch vụ',
            icon: Contact,
            data: [
                {
                    icon: '',
                    title: 'Thiết kế / xây dựng website',
                    link: '',
                },
            ],
        },
        {
            title: 'Liên hệ',
            icon: Mail,
            data: [
                {
                    icon: '',
                    title: 'ktqnews@gmail.com',
                    link: '',
                },
            ],
        },
    ];
}
