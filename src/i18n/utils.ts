import { ui, defaultLang } from "./ui";

export const PRIMARY_LANGUAGE = "de";
export const SECONDARY_LANGUAGE = "en";

export type TranslationKey = keyof (typeof ui)[typeof defaultLang];

export function getLangFromUrl(url: string | URL) {
    const path = typeof url === "string" ? url : url.pathname;
    const [, lang] = path.split("/");
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof (typeof ui)[typeof defaultLang] | undefined | null) {
        if (!key) {
            return "";
        }
        return ui[lang][key] || ui[defaultLang][key];
    };
}

export function getPathWithoutLocale(fullPath: string): string {
    const path =
        fullPath.charAt(3) === "/" || fullPath === `/${SECONDARY_LANGUAGE}` || fullPath === `/${PRIMARY_LANGUAGE}`
            ? fullPath.substring(3)
            : fullPath;
    const pathNoSlash = path.charAt(0) === "/" ? path.substring(1) : path;
    return pathNoSlash;
}

/** Omit from the sitemap any pages that aren't prefixed with a locale */
export const sitemapIgnoreRoot = (fullPath: string): boolean => {
    // Extract the file path without the full site name
    const path = fullPath.replace(/https?:\/\/[a-z.-]*\//, "/");
    return path === "/" || !!path.match(/^[/][a-z]{2}(-[a-zA-Z]{2})?([/]|$)/);
};
