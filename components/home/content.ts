import { Airplay, BarChart, Globe, Palette } from "lucide-react";

export const FEATURES_LIST = [
  {
    title: "Analytics that matter",
    shortTitle: "Advanced Analytics",
    content:
      "Vtae helps you gain insights into your audience and their behavior. Understand who checks your portfolio and which projects are most popular.",
    icon: BarChart,
    slug: "features/analytics",
    image: "/screenshot-analytics.png",
    imageDark: "/screenshot-analytics-dark.png",
  },
  {
    title: "Use your own domain",
    shortTitle: "Custom Links",
    content:
      "Use your own domain for your portfolio. Show what's important to you and your audience. Build your brand with every click.",
    icon: Airplay,
    slug: "features/branded-links",
    image: "/screenshot-domain.png",
    imageDark: "/screenshot-domain-dark.png",
  },
  {
    title: "Multi theme support",
    shortTitle: "Theming",
    content:
      "Vtae supports multiple themes. Choose from a variety of themes to make your portfolio stand out.",
    icon: Palette,
    slug: "features/qr-codes",
    image: "/screenshot-themes.png",
    imageDark: "/screenshot-themes-dark.png",
  },
  // {
  //   title: "Multi language support",
  //   shortTitle: "Languages",
  //   content:
  //     "Reach a wider audience by translating your portfolio into multiple languages. Vtae supports multiple languages out of the box.",
  //   icon: Languages,
  //   slug: "features/personalization",
  // },
  {
    title: "Multi portfolio support",
    shortTitle: "Portfolios",
    content:
      "Create multiple portfolios for different use cases. Share your portfolio with the world and keep your personal portfolio private.",
    icon: Globe,
    slug: "features/collaboration",
    image: "/screenshot-multi.png",
    imageDark: "/screenshot-multi-dark.png",
  },
  // {
  //   title: "Generate your CV",
  //   shortTitle: "CV",
  //   content:
  //     "Generate your CV from your portfolio. Stand out of the crowd with a beautiful PDF resume while applying for a job.",
  //   icon: FileText,
  //   slug: "docs/api-reference/introduction",
  // },
];
