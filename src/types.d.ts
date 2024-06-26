import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import type { HTMLAttributes, ImageMetadata } from "astro/types";

export type TranslatedString = string | null;

export interface Post {
    /** A unique ID number that identifies a post. */
    id: string;

    /** A post’s unique slug – part of the post’s URL based on its name, i.e. a post called “My Sample Page” has a slug “my-sample-page”. */
    slug: string;

    /**  */
    permalink: string;

    /**  */
    publishDate: Date;
    /**  */
    updateDate?: Date;

    /**  */
    title: string;
    /** Optional summary of post content. */
    excerpt?: string;
    /**  */
    image?: ImageMetadata | string;

    /**  */
    category?: string;
    /**  */
    tags?: Array<string>;
    /**  */
    author?: string;

    /**  */
    metadata?: MetaData;

    /**  */
    draft?: boolean;

    /**  */
    Content?: AstroComponentFactory;
    content?: string;

    /**  */
    readingTime?: number;
}

export interface MetaData {
    title?: string;
    ignoreTitleTemplate?: boolean;

    canonical?: string;

    robots?: MetaDataRobots;

    description?: string;

    openGraph?: MetaDataOpenGraph;
    twitter?: MetaDataTwitter;
}

export interface MetaDataRobots {
    index?: boolean;
    follow?: boolean;
}

export interface MetaDataImage {
    url: string;
    width?: number;
    height?: number;
}

export interface MetaDataOpenGraph {
    url?: string;
    siteName?: string;
    images?: Array<MetaDataImage>;
    locale?: string;
    type?: string;
}

export interface MetaDataTwitter {
    handle?: string;
    site?: string;
    cardType?: string;
}

export interface IconWithLink {
    name: string;
    href?: string;
    class?: string;
    title?: TranslatedString;
}

export interface Image {
    src: string;
    alt?: TranslatedString;
}

export interface Video {
    src: string;
    type?: string;
}

export interface Widget {
    id?: string;
    isDark?: boolean;
    bg?: string;
    classes?: Record<string, string | Record<string, string>>;
}

export interface Headline {
    title?: TranslatedString;
    subtitle?: TranslatedString;
    tagline?: TranslatedString;
    classes?: Record<string, string>;
}

interface TeamMember {
    name?: string;
    job?: string;
    image?: Image;
    socials?: Array<Social>;
    description?: string;
    classes?: Record<string, string>;
}

interface Social {
    icon?: string;
    href?: string;
}

type IconWithAlt = {
    icon: string;
    alt: string;
};

export interface Stat {
    amount?: number | string;
    title?: TranslatedString;
    icons?: (string | IconWithAlt)[];
    icon?: string;
}

export interface Item {
    title?: TranslatedString;
    description?: TranslatedString;
    icon?: string;
    /** Think Ahead addition, not supported everywhere */
    subitems?: Array<Omit<Item, "callToAction">>;
    classes?: Record<string, string>;
    callToAction?: CallToAction;
    image?: Image;
}

export interface Price {
    title?: string;
    subtitle?: string;
    description?: string;
    price?: number | string;
    period?: string;
    items?: Array<Item>;
    callToAction?: CallToAction;
    hasRibbon?: boolean;
    ribbonTitle?: string;
}

export interface Testimonial {
    title?: string;
    testimonial?: string;
    name?: string;
    job?: string;
    image?: string | unknown;
}

export interface Input {
    type: HTMLInputTypeAttribute;
    value?: string;
    required?: boolean;
    name: string;
    label?: TranslatedString;
    autocomplete?: string;
    placeholder?: string;
}

export interface Textarea {
    label?: TranslatedString;
    name?: string;
    required?: boolean;
    placeholder?: TranslatedString;
    rows?: number;
}

export interface Disclaimer {
    label?: string;
    required?: boolean;
}

// COMPONENTS
export interface CallToAction extends Omit<HTMLAttributes<"a">, "slot"> {
    variant?: "primary" | "secondary" | "tertiary" | "link";
    text?: TranslatedString;
    icon?: string;
    classes?: Record<string, string>;
    type?: "button" | "submit" | "reset";
}

export interface ItemGrid {
    items?: Array<Item>;
    columns?: number;
    defaultIcon?: string;
    classes?: Record<string, string>;
}

export interface Collapse {
    iconUp?: string;
    iconDown?: string;
    items?: Array<Item>;
    columns?: number;
    classes?: Record<string, string>;
}

export interface Form {
    name: string;
    target: string;
    inputs?: Array<Input>;
    textarea?: Textarea;
    disclaimer?: Disclaimer;
    button?: TranslatedString;
    description?: TranslatedString;
}

// WIDGETS
export interface Hero extends Omit<Headline, "classes">, Widget {
    content?: string;
    image?: string | unknown;
    callToAction1?: CallToAction;
    callToAction2?: CallToAction;
    isReversed?: boolean;
}

export interface Team extends Omit<Headline, "classes">, Widget {
    team?: Array<TeamMember>;
}

export interface Stats extends Omit<Headline, "classes">, Widget {
    stats?: Array<Stat>;
}

export interface Pricing extends Omit<Headline, "classes">, Widget {
    prices?: Array<Price>;
}

export interface Testimonials extends Omit<Headline, "classes">, Widget {
    testimonials?: Array<Testimonial>;
    callToAction?: CallToAction;
}

export interface Brands extends Omit<Headline, "classes">, Widget {
    icons?: Array<IconWithLink>;
    images?: Array<Image>;
}

export interface Features extends Omit<Headline, "classes">, Widget {
    image?: string | unknown;
    video?: Video;
    items?: Array<Item>;
    columns?: number;
    defaultIcon?: string;
    callToAction1?: CallToAction;
    callToAction2?: CallToAction;
    isReversed?: boolean;
    isBeforeContent?: boolean;
    isAfterContent?: boolean;
}

export interface Faqs extends Omit<Headline, "classes">, Widget {
    iconUp?: string;
    iconDown?: string;
    items?: Array<Item>;
    columns?: number;
}

export interface Steps extends Omit<Headline, "classes">, Widget {
    items: Array<{
        title: string;
        description?: string;
        icon?: string;
        classes?: Record<string, string>;
    }>;
    callToAction?: string | CallToAction;
    image?: string | Image;
    isReversed?: boolean;
}

export interface Content extends Omit<Headline, "classes">, Widget {
    content?: string;
    image?: string | unknown;
    items?: Array<Item>;
    columns?: number;
    isReversed?: boolean;
    isAfterContent?: boolean;
    callToAction?: CallToAction;
}

export interface Contact extends Omit<Headline, "classes">, Form, Widget {
    name: string;
    /** Where the user is taken on clicking Submit */
    target: string;
}
