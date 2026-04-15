import { withAuth } from "next-auth/middleware";
import createMiddleware from 'next-intl/middleware';
import { locales, routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
    // Reutiliza el middleware de intl para que las rutas sigan funcionando
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token }) => token?.name === "Admin",
        },
        pages: {
            signIn: "/auth/login",
        },
    }
);

export default function proxy(req: NextRequest) {
    const adminPattern = RegExp(`^(/(${locales.join('|')}))?/admin(/.*)?$`, 'i');
    const isProtectedPage = adminPattern.test(req.nextUrl.pathname);

    if (isProtectedPage) {
        return (authMiddleware as any)(req);
    } else {
        return intlMiddleware(req);
    }
}

export const config = {
    // Coincidir con todas las rutas excepto archivos estáticos y API interna
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
