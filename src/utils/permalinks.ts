import slugify from "limax";

import { SITE, APP_BLOG } from "astrowind:config";

import { trim } from "~/utils/utils";
import { PRIMARY_LANGUAGE } from "~/i18n/utils";

/**
 * Null (default) indicates we're dealing with locales elsewhere, e.g. in the Header components.
 * Otherwise, a locale will be prepended to the path, defaulting to PRIMARY_LANGUAGE if missing.
 */
type LocaleParameter = string | null | undefined;

export const trimSlash = (s: string) => trim(trim(s, "/"));

const createPath = (...params: string[]) => {
    const paths = params
        .map((el) => trimSlash(el))
        .filter((el) => !!el)
        .join("/");
    return "/" + paths + (SITE.trailingSlash && paths ? "/" : "");
};

const BASE_PATHNAME = SITE.base || "/";

export const cleanSlug = (text = "") =>
    trimSlash(text)
        .split("/")
        .map((slug) => slugify(slug))
        .join("/");

export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || "tag";

export const POST_PERMALINK_PATTERN = trimSlash(APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`);

/** */
export const getCanonical = (path = ""): string | URL => {
    const url = String(new URL(path, SITE.site));
    if (SITE.trailingSlash == false && path && url.endsWith("/")) {
        return url.slice(0, -1);
    } else if (SITE.trailingSlash == true && path && !url.endsWith("/")) {
        return url + "/";
    }
    return url;
};

export const getPagePermalink = (slug = "", locale: LocaleParameter = null): string =>
    getPermalink(slug, "page", locale);

/** */
export const getPermalink = (slug = "", type = "page", locale: LocaleParameter = null): string => {
    let permalink: string;

    switch (type) {
        case "category":
            permalink = createPath(CATEGORY_BASE, trimSlash(slug));
            break;

        case "tag":
            permalink = createPath(TAG_BASE, trimSlash(slug));
            break;

        case "post":
            permalink = createPath(trimSlash(slug));
            break;

        case "page":
        default:
            permalink = createPath(slug);
            break;
    }

    return definitivePermalink(permalink, locale);
};

/** */
export const getHomePermalink = (locale: LocaleParameter = null): string => getPagePermalink("/", locale);

/** */
export const getBlogPermalink = (locale: LocaleParameter): string => getPagePermalink(BLOG_BASE, locale);

/** */
export const getAsset = (path: string): string =>
    "/" +
    [BASE_PATHNAME, path]
        .map((el) => trimSlash(el))
        .filter((el) => !!el)
        .join("/");

/** */
const definitivePermalink = (permalink: string, locale: LocaleParameter): string =>
    locale === null
        ? createPath(BASE_PATHNAME, permalink)
        : createPath(locale || PRIMARY_LANGUAGE, BASE_PATHNAME, permalink);
