import axios from 'axios';
import Routes from './routes';
import fs from 'fs';

export function copyToClipboard(text: string, onSuccess?: () => void): void {
    if (!navigator.clipboard) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Không thể copy nội dung: ', err);
        }

        document.body.removeChild(textarea);
    } else {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                if (onSuccess) onSuccess();
            })
            .catch((err) => console.error('Lỗi khi copy nội dung: ', err));
    }
}

export const handleFilterChange = (name: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
};

export const handleClearFilterChange = () => {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.pushState({}, '', url);
};

export const generateCoppyLink = (data: IPost) => {
    return `${window.location.origin}${Routes.POSTS}/${data._id}`;
};

export const isValidUrl = (url: string) => {
    const regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return regex.test(url);
};

export async function downloadImage(url: string, filepath: string) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
        response.data
            .pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath));
    });
}

export const generateTTR = (raw: string) => {
    return `${(Number(raw) / 60).toFixed(0)} phút đọc`;
};

export function isValidJSONObject(str: string): boolean {
    try {
        const parsed = JSON.parse(str);
        return typeof parsed === 'object';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false;
    }
}
