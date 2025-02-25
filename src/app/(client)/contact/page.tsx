/* eslint-disable @next/next/no-img-element */
import ContactEmailSession from '@/components/contact/contact-email-session';
import FormSend from '@/components/contact/form-send';
import Loading from '@/components/loading';
import Constant from '@/constants';
import { getStaticData } from '@/ultils/data-fn';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: `Liên hệ | ${process.env.LOGO_NAME}`,
    description: Constant.DESCRIPTION,
};

export default async function Contact() {
    const staticData = await getStaticData();
    return (
        <div className="w-full h-full grid grid-cols-12 gap-5 lg:gap-10 mt-5">
            <div className="col-span-6 relative min-h-[500px] md:flex justify-center items-center hidden">
                <div className="md:w-full lg:w-3/4 relative h-full rounded-lg shadow-xl overflow-hidden">
                    <img className="w-full h-full object-cover" src={staticData?.images['contact-image-1'] || ''} alt="contact" />
                </div>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-5">
                <div className="flex items-center flex-col justify-center w-full gap-2 ">
                    <span className="text-3xl font-medium">Liên hệ với chúng tôi</span>
                </div>
                <div className="flex flex-col gap-4 w-full rounded-sm">
                    <FormSend />

                    <Suspense fallback={<Loading className="min-h-0" />}>
                        <ContactEmailSession />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
