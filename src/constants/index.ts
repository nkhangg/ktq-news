import Routes from '@/ultils/routes';
import { Box, Contact, Mail, Store } from 'lucide-react';

export default class Constant {
    public static FOOTER_DATA_KEY = 'footer-data';
    public static ABOUT_DATA_KEY = 'about-data';

    public static CONTACT_EMAIL_KEY = 'contact-email';
    public static PRIMARY_EMAIL_KEY = 'primary-email';
    public static SERVICE_DATA_KEY = 'service-data';
    public static PRODUCTS_DATA_KEY = 'products-data';
    public static CONTACTS_DATA_KEY = 'contacts-data';
    public static DESCRIPTION_WEBSITE = 'description-website';

    public static PARAMS_KEYS = ['category', 'ttr', 'sortBy', 'page', 'search', 'tags'];

    public static icons = {
        [this.ABOUT_DATA_KEY]: Store,
        [this.SERVICE_DATA_KEY]: Contact,
        [this.PRODUCTS_DATA_KEY]: Box,
        [this.CONTACTS_DATA_KEY]: Mail,
    };

    public static DESCRIPTION =
        '"ktq-blogs - Khám phá tri thức đa chiều! 📖💡 Từ triết học, tâm lý, khoa học đến công nghệ, lịch sử, và đời sống. Nơi tổng hợp kiến thức với góc nhìn hài hước nhưng sâu sắc, giúp bạn hiểu thế giới theo cách thú vị nhất!"';

    // Các config data
    public static initConfigsData = [
        {
            key: Constant.CONTACT_EMAIL_KEY,
            value: 'ktqnews@gmail.com',
        },
        {
            key: Constant.PRIMARY_EMAIL_KEY,
            value: 'ktq@gmail.com',
        },
        {
            key: this.FOOTER_DATA_KEY,
            value: [
                {
                    key: this.ABOUT_DATA_KEY,
                    title: 'Về chúng tôi',
                    data: Routes.MENUS,
                },
                {
                    key: this.PRODUCTS_DATA_KEY,
                    title: 'Sản phẩm',
                    data: [
                        {
                            icon: '',
                            title: 'Ktq News',
                            link: Routes.HOME,
                        },
                    ],
                },
                {
                    key: this.SERVICE_DATA_KEY,
                    title: 'Dịch vụ',
                    data: [
                        {
                            icon: '',
                            title: 'Thiết kế / xây dựng website',
                            link: '',
                        },
                    ],
                },
                {
                    key: this.CONTACTS_DATA_KEY,
                    title: 'Liên hệ',
                    data: [
                        {
                            icon: '',
                            title: 'ktqnews@gmail.com',
                            link: '',
                        },
                    ],
                },
            ],
        },
        {
            key: this.DESCRIPTION_WEBSITE,
            value: `KTQ News là trang web chia sẻ kiến thức đa lĩnh vực, nơi bạn có thể khám phá những thông tin bổ ích về công nghệ, đời sống và nhiều chủ đề hấp dẫn khác. Chúng tôi cung cấp nội dung chất lượng, giúp bạn dễ dàng tiếp cận với nguồn thông tin đáng tin cậy.`,
        },
    ];

    public static getPrimaryEmail = (data: IConfig[]) => {
        return data.find((item) => item.key_name === this.PRIMARY_EMAIL_KEY);
    };

    public static getContactEmail = (data: IConfig[]) => {
        return data.find((item) => item.key_name === this.CONTACT_EMAIL_KEY);
    };

    public static getFooterData = (data: IConfig[]) => {
        return data.find((item) => item.key_name === this.FOOTER_DATA_KEY);
    };

    public static getDescriptionWebsite = (data: IConfig[]) => {
        return data.find((item) => item.key_name === this.DESCRIPTION_WEBSITE);
    };
}
