import { SystemLang } from '@/lang/system.lang';
import { z } from 'zod';

const NAME_MIN = 4;
const PASS_MIN = 6;

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(
                NAME_MIN,
                SystemLang.getCustomText({
                    vi: `Tên phải có ít nhất ${NAME_MIN} ký tự`,
                    en: `Name must have at least ${NAME_MIN} characters`,
                }),
            )
            .optional(),

        email: z.string().email(
            SystemLang.getCustomText({
                vi: 'Email không hợp lệ',
                en: 'Invalid email',
            }),
        ),

        password: z.string().min(
            PASS_MIN,
            SystemLang.getCustomText({
                vi: `Mật khẩu phải có ít nhất ${PASS_MIN} ký tự`,
                en: `Password must have at least ${PASS_MIN} characters`,
            }),
        ),

        confirmPassword: z.string(),

        terms: z.boolean().refine((val) => val === true, {
            message: SystemLang.getCustomText({
                vi: 'Bạn phải chấp nhận điều khoản và điều kiện',
                en: 'You must accept the terms and conditions',
            }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: SystemLang.getCustomText({
            vi: 'Mật khẩu nhập lại không khớp',
            en: 'Passwords do not match',
        }),
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    email: z.string().email(
        SystemLang.getCustomText({
            vi: 'Email không hợp lệ',
            en: 'Invalid email',
        }),
    ),

    password: z.string().min(
        PASS_MIN,
        SystemLang.getCustomText({
            vi: `Mật khẩu phải có ít nhất ${PASS_MIN} ký tự`,
            en: `Password must have at least ${PASS_MIN} characters`,
        }),
    ),
});
