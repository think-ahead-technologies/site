import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import icon from "astro-icon";
import compress from "astro-compress";

import astroI18next from "astro-i18next";
import astroI18nextReloader from "./astro-i18next-reloader";
import { sitemapIgnoreRoot } from "./src/i18n/utils";

import astrowind from "./src/integration";

import {
    readingTimeRemarkPlugin,
    responsiveTablesRehypePlugin,
    lazyImagesRehypePlugin
} from "./src/utils/frontmatter.mjs";

import react from "@astrojs/react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items = []) =>
    hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
    output: "static",

    i18n: {
        locales: ["en", "de"],
        defaultLocale: "de",
        // fallback: {
        //     // NB fallback pages will cause the blog to not produce EN pages.
        //     en: "de"
        // },
        routing: {
            prefixDefaultLocale: true
        }
    },

    integrations: [
        tailwind({
            applyBaseStyles: false
        }),
        sitemap({
            filter: sitemapIgnoreRoot,
            i18n: {
                defaultLocale: "de",
                locales: {
                    en: "en",
                    de: "de" // The `defaultLocale` value must present in `locales` keys
                }
            }
        }),
        mdx(),
        astroI18next(),
        astroI18nextReloader(),
        icon({
            include: {
                tabler: ["*"],
                "flat-color-icons": [
                    "template",
                    "gallery",
                    "approval",
                    "deployment",
                    "document",
                    "advertising",
                    "currency-exchange",
                    "voice-presentation",
                    "business-contact",
                    "settings",
                    "lock",
                    "database"
                ],
                "material-symbols": [
                    "account-balance-outline-rounded",
                    "cloud",
                    "construction",
                    "clinical-notes-outline",
                    "dataset-linked-rounded",
                    "deployed-code-outline",
                    "deployed-code-account-outline",
                    "deployed-code-history-outline",
                    "design-services-outline",
                    "emoji-people",
                    "euro-symbol-rounded",
                    "handshake-outline",
                    "navigate-next",
                    "person-raised-hand-outline",
                    "search-insights",
                    "settings-heart",
                    "show-chart-rounded",
                    "smartphone-outline",
                    "sunny-outline-rounded",
                    "upgrade"
                ],
                "simple-icons": [
                    "amazonwebservices",
                    "googlecloud",
                    "hetzner",
                    "microsoftazure",
                    "openstack",
                    "redhatopenshift",
                    "scaleway"
                ],
                fa: ["lightbulb-o"],
                ph: [
                    "graduation-cap",
                    "microscope-bold"
                ]
                }
        }),
        ...whenExternalScripts(() =>
            partytown({
                config: { forward: ["dataLayer.push"] }
            })
        ),
        compress({
            CSS: true,
            HTML: {
                "html-minifier-terser": {
                    removeAttributeQuotes: false
                }
            },
            Image: false,
            JavaScript: true,
            SVG: false,
            Logger: 1
        }),
        astrowind(),
        react()
    ],

    markdown: {
        remarkPlugins: [readingTimeRemarkPlugin],
        rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin]
    },

    vite: {
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "./src")
            }
        }
    }
});
