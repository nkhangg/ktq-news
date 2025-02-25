/* eslint-disable @next/next/no-img-element */
import ContactSession from '@/components/about/contact-session';
import { Logo } from '@/components/common';
import Loading from '@/components/loading';
import Constant from '@/constants';
import { getStaticData } from '@/ultils/data-fn';
import { Rocket, Settings2, Sparkle } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';
import BoxAboutSession from './box-about-session';

export const metadata: Metadata = {
    title: `Về chúng tôi | ${process.env.LOGO_NAME}`,
    description: Constant.DESCRIPTION,
};

export default async function About() {
    const staticData = await getStaticData();

    return (
        <div className="flex flex-col gap-5 py-10">
            <div className="flex items-center flex-col justify-center w-full gap-2">
                <span className="text-3xl font-medium">
                    Về chúng tôi <Logo />
                </span>
                <p className="font-medium text-center">{Constant.DESCRIPTION}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
                <div className="flex flex-col justify-between h-full gap-5">
                    <BoxAboutSession icon={Sparkle} title={`Sứ mệnh của ${process.env.LOGO_NAME}`}>
                        <p>
                            {process.env.LOGO_NAME} ra đời với sứ mệnh cung cấp kiến thức chuyên sâu và đa dạng về công nghệ, đời sống, và các sản phẩm hữu ích. Chúng tôi không chỉ
                            là nơi để bạn tìm hiểu thông tin mà còn là nguồn cảm hứng giúp bạn đưa ra quyết định sáng suốt trong thế giới số ngày nay.
                        </p>
                    </BoxAboutSession>

                    <BoxAboutSession icon={Rocket} title={`Lịch sử hình thành ${process.env.LOGO_NAME}`}>
                        <p>
                            {process.env.LOGO_NAME} được sáng lập vào năm 2025 bởi đội ngũ yêu công nghệ và đam mê chia sẻ tri thức. Với khát vọng tạo ra một cộng đồng nơi mọi
                            người có thể cập nhật thông tin một cách nhanh chóng và chính xác, chúng tôi không ngừng cải tiến nội dung và trải nghiệm người dùng.
                        </p>
                    </BoxAboutSession>
                </div>

                <div className="hidden md:flex items-center justify-center">
                    <div className="relative md:h-full lg:h-[600px] md:w-[90%] lg:w-3/4 rounded-lg overflow-hidden shadow-lg">
                        <img loading="lazy" className="object-cover w-full h-full" src={staticData.images['about-image-1']} alt={staticData.images['about-image-1']} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5 md:mt-20">
                <div className="hidden md:flex items-center justify-center ">
                    <div className="relative md:h-full lg:h-[600px] md:w-[90%] lg:w-3/4 rounded-lg overflow-hidden shadow-lg">
                        <img className="object-cover w-full h-full" src={staticData.images['about-image-2']} alt={staticData.images['about-image-2']} />
                    </div>
                </div>
                <div className="flex flex-col justify-between h-full gap-5 ">
                    <BoxAboutSession icon={Settings2} title={`Giá trị cốt lõi của ${process.env.LOGO_NAME}`}>
                        <ul>
                            <li>Chính xác: Nội dung được kiểm chứng trước khi đăng tải.</li>
                            <li>Hữu ích: Chỉ chia sẻ những thông tin có giá trị cho người đọc.</li>
                            <li>Cập nhật: Luôn nắm bắt xu hướng và sự kiện mới nhất.</li>
                            <li>Trung lập: Không thiên vị trong đánh giá sản phẩm và thông tin.</li>
                        </ul>
                    </BoxAboutSession>

                    <Suspense fallback={<Loading className="min-h-0" />}>
                        <ContactSession />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
