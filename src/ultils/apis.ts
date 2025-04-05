import { SystemLang } from '@/lang/system.lang';
import { IResponse } from '@/types/axios.type';
import { notifications } from '@mantine/notifications';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import _ from 'lodash';
export const handleSuccess = <R>(response: AxiosResponse<IResponse<R>>) => {
    if (!response.data || ![HttpStatusCode.Ok, HttpStatusCode.Created].includes(response.status)) {
        return;
    }

    notifications.show({
        title: SystemLang.getText('labels', 'notification'),
        message: response.data?.message || SystemLang.getText('messages', 'success'),
        color: 'green',
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = <R>(error: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (error as AxiosError<IResponse<R>>).response;

    if ([HttpStatusCode.Ok, HttpStatusCode.Created].includes(response?.status || 400)) {
        return;
    }

    let message = SystemLang.getText('messages', 'success');

    if (response?.data.errors && response?.data.errors.length > 0) {
        const totalErrors = _.sumBy(response.data.errors, (item) => item.errors.length) - 1;

        message = `${response?.data.errors[0].errors[0]} ${
            response?.data.errors.length > 1
                ? SystemLang.getCustomText({
                      vi: `và ${totalErrors} lỗi khác`,
                      en: `and ${totalErrors} errors`,
                  })
                : ''
        }`;
    } else if (response?.data.message) {
        message = response.data.message;
    }

    notifications.show({
        title: SystemLang.getText('labels', 'notification'),
        message: message,
        color: 'red',
    });
};
