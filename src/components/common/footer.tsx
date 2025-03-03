import Constant from '@/constants';
import { getFooterData } from '@/ultils/data-fn';
import { LucideProps } from 'lucide-react';
import Link from 'next/link';
import { ForwardRefExoticComponent, Fragment, RefAttributes } from 'react';
import { Button } from '../ui/button';
import Logo from './logo';

export default async function Footer() {
    const configs: IConfig[] = await getFooterData();

    const footerData = (JSON.parse((Constant.getFooterData(configs)?.value as string) || '{}') as Record<string, string | []>[]) || [];

    const primaryEmail = (Constant.getPrimaryEmail(configs)?.value as string) || '';

    const description = (Constant.getDescriptionWebsite(configs)?.value as string) || '';
    return (
        <footer className="w-full max-w-full items-center justify-center px-5 flex-col flex py-5 mt-10">
            <div className="w-full max-w-7xl py-5 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className=" md:col-span-5 lg:col-span-4 flex flex-col gap-2">
                    <Logo />
                    <p className="text-[14px] ">{description}</p>
                </div>

                <div className="md:col-span-7 lg:col-span-8 md:ml-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-4 lg:gap-2">
                    {footerData.map((item) => {
                        return (
                            <Fragment key={item.title as string}>
                                <div className="">
                                    <span className="font-semibold text-lg flex items-center gap-2">
                                        {/* <Constant.icons[item.key] size={16} /> */}
                                        {(() => {
                                            const Icon = Constant.icons[item.key as string] as ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

                                            return <Icon size={16} />;
                                        })()}
                                        <p>{item.title}</p>
                                    </span>

                                    <ul>
                                        {(item.data as Record<string, string>[]).map((i) => {
                                            return (
                                                <li key={i.title}>
                                                    <Link href={i.link}>
                                                        <Button variant={'link'} className="pl-0">
                                                            {i.title}
                                                        </Button>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="">
                <span className="text-sm font-medium">© 2025 Powered by KTQ. Email: {primaryEmail}</span>
            </div>
        </footer>
    );
}
