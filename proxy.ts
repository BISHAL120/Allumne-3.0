import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from './lib/get-session';

export async function proxy(request: NextRequest) {
    const session = await getServerSession();
    const { pathname } = request.nextUrl;

    const protectedApiRoutes: { pattern: string; roles?: string[] }[] = [
        { pattern: '/api/admin/*', roles: ['ADMIN'] },
        { pattern: '/api/artists/*', roles: ['ARTIST', 'COLLECTOR', 'ADMIN'] },
        // Add other protected API routes here
    ];

    // Protected page routes with role requirements
    const protectedPageRoutes: { pattern: string; roles?: string[] }[] = [
        { pattern: '/admin/*', roles: ['ADMIN'] },
        { pattern: '/dashboard/*', roles: ['ARTIST', 'COLLECTOR', 'ADMIN'] },
    ];

    // Helper function to check if path matches a pattern
    const matchesPattern = (path: string, pattern: string): boolean => {
        const regexPattern = pattern.replace('/*', '(/.*)?');
        const regex = new RegExp('^' + regexPattern + '$');
        return regex.test(path);
    };

    // Helper function to find matching route
    const findMatchingRoute = (
        path: string,
        routes: { pattern: string; roles?: string[] }[]
    ) => {
        return routes.find(route => matchesPattern(path, route.pattern));
    };

    // Authentication routes to redirect if logged in
    const authRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

    // Check if current path is an auth route
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname.startsWith('/api/')) {
        const matchedApiRoute = findMatchingRoute(pathname, protectedApiRoutes);
        if (!matchedApiRoute) {
            return NextResponse.next();
        }
        if (!session) {
            return NextResponse.json(
                { message: 'Authentication required.' },
                { status: 401 }
            );
        }
        const requiredRoles = matchedApiRoute.roles;
        if (requiredRoles && !requiredRoles.some(role => session.user?.role?.includes(role))) {
            return NextResponse.json(
                { message: 'You are not authorized to access this resource.' },
                { status: 403 }
            );
        }
        return NextResponse.next();
    }

    const matchedPageRoute = findMatchingRoute(pathname, protectedPageRoutes);
    if (!matchedPageRoute) {
        return NextResponse.next();
    }
    if (!session) {
        return NextResponse.redirect(new URL('/unauthenticated', request.url));
    }
    const requiredRoles = matchedPageRoute.roles;
    if (requiredRoles && !requiredRoles.some(role => session.user?.role?.includes(role))) {
        return NextResponse.redirect(new URL('/unauthorize', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
