import { Breadcrumb as Br, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Routes from '@/ultils/routes';
import { Fragment } from 'react';
export interface IBreadcrumbProps {
    data: { pageName: string; link?: string }[];
}

export default function Breadcrumb({ data }: IBreadcrumbProps) {
    return (
        <Br>
            <BreadcrumbList className="w-full max-w-full text-wrap">
                <BreadcrumbItem>
                    <BreadcrumbLink href={Routes.HOME}>Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>

                {data.map((item) => {
                    return (
                        <Fragment key={item.pageName}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {item.link ? (
                                    <BreadcrumbLink className="max-w-full line-clamp-2" href={item.link}>
                                        {item.pageName}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage className="max-w-full line-clamp-2">{item.pageName}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Br>
    );
}
