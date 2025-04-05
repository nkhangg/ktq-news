'use client';

import { Anchor, Button, Checkbox, Divider, Group, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useEffect } from 'react';
import { GoogleButton } from '../components';
import { useAuthenticationFn, useAuthenticationHook } from '../hooks';
import { useRouter } from 'next/navigation';
import { loginSchema, registerSchema } from '../validations/schema';

export interface IAuthenticationBasicPageProps {
    options?: {
        login_with_google: boolean;
    };
}

export default function AuthenticationBasicPage({ options }: IAuthenticationBasicPageProps) {
    const [type, toggle] = useToggle(['login', 'register']);

    const router = useRouter();

    const { handleSubmit } = useAuthenticationHook({
        type,
        success: (type) => {
            if (type === 'login') {
                router.push('/');
            } else {
                toggle('login');
            }
        },
    });

    const { loginWithGoogle } = useAuthenticationFn();

    const form = useForm({
        validate: zodResolver(type === 'login' ? loginSchema : registerSchema),
        initialValues: {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
            terms: false,
        },
    });

    useEffect(() => {
        form.clearErrors();
        form.reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    return (
        <Paper radius="md" p="xl" withBorder>
            <Text size="lg" fw={500} mb={'md'} ta={'center'}>
                Chào mừng bạn đến với <b>{process.env.NEXT_PUBLIC_LOGO_NAME}</b>, {type === 'register' ? 'đăng ký' : 'đăng nhập'} ngay!
            </Text>

            {options?.login_with_google && (
                <>
                    <Group grow mb="md">
                        <GoogleButton
                            onClick={() =>
                                loginWithGoogle(() => {
                                    router.push('/');
                                })
                            }
                            radius="xl"
                        >
                            Đăng nhập với Google
                        </GoogleButton>
                    </Group>
                    <Divider label="Hoặc tiếp tục với email" labelPosition="center" my="lg" />
                </>
            )}

            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Stack>
                    {type === 'register' && <TextInput label="Tên" placeholder="Nhập tên của bạn" {...form.getInputProps('name')} radius="md" />}

                    <TextInput label="Email" placeholder="Nhập email của bạn" {...form.getInputProps('email')} radius="md" />

                    <PasswordInput label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" {...form.getInputProps('password')} radius="md" />

                    {type === 'register' && (
                        <PasswordInput
                            label="Xác nhận mật khẩu"
                            placeholder="Nhập lại mật khẩu"
                            {...form.getInputProps('confirmPassword')}
                            error={form.errors.confirmPassword}
                            radius="md"
                        />
                    )}

                    {type === 'register' && <Checkbox label="Tôi đồng ý với điều khoản và điều kiện" {...form.getInputProps('terms', { type: 'checkbox' })} />}
                </Stack>

                <Group justify="space-between" mt="xl">
                    <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                        {type === 'register' ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký ngay'}
                    </Anchor>
                    <Button type="submit" radius="xl">
                        {upperFirst(type === 'register' ? 'Đăng ký' : 'Đăng nhập')}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}
