import Constant from '@/constants';
import { getContactData } from '@/ultils/data-fn';

export default async function ContactEmailSession() {
    const configs = await getContactData();

    const primaryEmail = (Constant.getPrimaryEmail(configs)?.value as string) || '';
    const contactEmail = (Constant.getContactEmail(configs)?.value as string) || '';
    return (
        <div>
            <ul className="text-sm">
                <li>
                    Liên hệ trược tiếp với chúng tôi qua email: <span className="font-medium">{contactEmail}</span>
                </li>
                <li>
                    Bạn có nhu cầu về dịch vụ khác bạn hãy liên hệ với chúng tôi qua email:
                    <span className="font-medium">{primaryEmail}</span>
                </li>
            </ul>
        </div>
    );
}
