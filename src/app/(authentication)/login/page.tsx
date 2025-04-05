import { AuthenticationBasicPage } from '@/modules/authentication/pages';
import * as React from 'react';

export default function LoginPage() {
    return <AuthenticationBasicPage options={{ login_with_google: true }} />;
}
