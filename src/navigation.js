import { getPermalink } from "./utils/permalinks";

// NB translations for these elements are found in: /src/i18n/ui.ts

export const headerData = {
    links: [
        {
            text: "nav.who-we-are",
            href: getPermalink(`/who-we-are`)
        },
        {
            text: "nav.solutions",
            links: [
                {
                    text: "nav.cloud",
                    href: getPermalink("/solutions/cloud")
                },
                {
                    text: "nav.platform",
                    href: getPermalink("/solutions/platform")
                },
                {
                    text: "nav.security",
                    href: getPermalink("/solutions/security")
                }
            ]
        }
        // {
        //   text: 'nav.partners',
        //   links: [
        //     { text: 'TODO', href: getPermalink('/partners/todo') }
        //   ],
        // },
        // {
        //     text: "nav.blog",
        //     href: getBlogPermalink()
        // }
    ],
    actions: [{ text: "nav.contact", href: "/contact" }]
};

// NB URLs here are altered for locales by components/common/widgets/Footer.astro
export const footerData = {
    links: [
        {
            title: "nav.solutions",
            links: [
                {
                    text: "nav.cloud",
                    href: getPermalink("/solutions/cloud")
                },
                {
                    text: "nav.platform",
                    href: getPermalink("/solutions/platform")
                },
                {
                    text: "nav.security",
                    href: getPermalink("/solutions/security")
                }
            ]
        },
        {
            title: "nav.languages",
            links: [
                { text: "lang.de", href: "de" },
                { text: "lang.en", href: "en" }
            ]
        }
    ],
    /** These links won't link to the /en/equivalent page in the nav.languages footer. */
    noTranslation: ["impressum", "privacy"],
    secondaryLinks: [
        { text: "nav.terms", href: getPermalink("/de/impressum") },
        { text: "nav.privacypolicy", href: getPermalink("/de/privacy") }
    ],
    socialLinks: [
        {
            ariaLabel: "LinkedIn",
            icon: "tabler:brand-linkedin",
            href: "https://www.linkedin.com/company/think-ahead-tech/"
        },
        {
            ariaLabel: "GitHub",
            icon: "tabler:brand-github",
            href: "https://github.com/think-ahead-technologies"
        },
        {
            ariaLabel: "X",
            icon: "tabler:brand-x",
            href: "https://twitter.com/thinkaheadtech"
        }
    ],
    footNote: `nav.footnote`
};
