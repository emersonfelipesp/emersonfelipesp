import { NextRequest, NextResponse } from "next/server";

const DOCS_PATH_PREFIX = "/netbox-proxbox/docs";
const STATIC_FILE_EXTENSION =
  /\.(?:avif|br|css|eot|gif|gz|ico|jpeg|jpg|js|json|map|mjs|pdf|png|svg|ttf|txt|webp|woff|woff2|xml|yaml|yml|zip)$/i;

function isDocsPath(pathname: string): boolean {
  return (
    pathname === DOCS_PATH_PREFIX || pathname.startsWith(`${DOCS_PATH_PREFIX}/`)
  );
}

function isStaticFilePath(pathname: string): boolean {
  return STATIC_FILE_EXTENSION.test(pathname);
}

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const url = new URL(request.url);
  url.pathname = pathname;
  return NextResponse.redirect(url, 308);
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (isDocsPath(pathname)) {
    if (!pathname.endsWith("/") && !isStaticFilePath(pathname)) {
      return redirectTo(request, `${pathname}/`);
    }
    return NextResponse.next();
  }

  if (pathname !== "/" && pathname.endsWith("/")) {
    return redirectTo(request, pathname.replace(/\/+$/, ""));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
