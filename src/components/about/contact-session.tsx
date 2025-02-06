import BoxAboutSession from '@/app/(client)/about/box-about-session';
import Constant from '@/constants';
import { getContactData } from '@/ultils/data-fn';
import { Contact } from 'lucide-react';

export default async function ContactSession() {
    const configs = await getContactData();

    const primaryEmail = (Constant.getPrimaryEmail(configs)?.value as string) || '';
    const contactEmail = (Constant.getContactEmail(configs)?.value as string) || '';
    return (
        <BoxAboutSession icon={Contact} title="Liên hệ với chúng tôi">
            <ul>
                <li>
                    Email liên hệ: <b>{contactEmail}</b>
                </li>
                <li>
                    Email dịch vụ: <b>{primaryEmail}</b>
                </li>
            </ul>
        </BoxAboutSession>
    );
}
