import path from "path";
import { fileURLToPath } from "url";

import { defineConfig, squooshImageService } from "astro/config";

import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import icon from "astro-icon";
import compress from "astro-compress";

import astroI18next from "astro-i18next";

import astrowind from "./src/integration";

import {
    readingTimeRemarkPlugin,
    responsiveTablesRehypePlugin,
    lazyImagesRehypePlugin
} from "./src/utils/frontmatter.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items = []) =>
    hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
    output: "static",

    i18n: {
        locales: ["en", "de"],
        defaultLocale: "de",
        fallback: {
            en: "de"
        },
        routing: {
            prefixDefaultLocale: true
        }
    },

    integrations: [
        tailwind({
            applyBaseStyles: false
        }),
        sitemap(),
        mdx(),
        astroI18next(),
        icon({
            include: {
                tabler: ["*"],
                "flat-color-icons": [
                    "template",
                    "gallery",
                    "approval",
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
                    "deployed-code-outline",
                    "deployed-code-account-outline",
                    "deployed-code-history-outline",
                    "dataset-linked-rounded",
                    "emoji-people",
                    "euro-symbol-rounded",
                    "handshake-outline",
                    "navigate-next",
                    "person-raised-hand-outline",
                    "settings-heart",
                    "smartphone-outline",
                    "sunny-outline-rounded"
                ],
                fa: ["lightbulb-o"],
                ph: ["graduation-cap"]
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

        astrowind()
    ],

    image: {
        service: squooshImageService()
    },

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
