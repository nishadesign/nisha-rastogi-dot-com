export type TimelineCategory = "life" | "travel" | "work";

export type TimelineEntry = {
  category: TimelineCategory;
  date: string;
  title: string;
  description?: string;
  href?: string;
  external?: boolean;
  image?: {
    src: string;
    alt: string;
  };
};

export const timeline: TimelineEntry[] = [
  
  {
    category: "life",
    date: "Unknown",
    title: "Build Coffee, CrossFit & Cocktail",
    description: "Everything that I love in one place — I will build this for myself and Vibhor.",
  },
  {
    category: "life",
    date: "2026",
    title: "Sam Stephenson, Ryo, and Soleio",
    description: "I saw Sam for the first time on the Dive Club podcast — I remember the next 48 hrs obsessing over everything he said about being a designer and design. Someday I hope to meet him in person. I saw Soleio baba at South Park Commons (hoping someday he will read 'baba' on my portfolio and get a good laugh). Knowing Sam, Ryo, and Soleio has been enlightening for my design journey.",
  },
  {
    category: "life",
    date: "2024",
    title: "Chalk up",
    description: "Joined CrossFit and am very much a part of this cult now.",
  },
  {
    category: "travel",
    date: "2023",
    title: "Oaxaca with Vibhor",
    description: "Spent 3 weeks in Oaxaca Centro in a co-living space. This trip made me realize I would want something like this for myself.",
  },
  {
    category: "work",
    date: "2022",
    title: "Financial independence",
    description: "I worked 3 jobs while doing my master's thesis to clear my debt. I have mad respect for that version of myself. I finally started my full-time Product Designer role at Salesforce.",
  },
  {
    category: "life",
    date: "2020",
    title: "Moved to US",
    description: "As much as I enjoyed being an automobile engineer, I lacked the patience that profession demanded. I moved to Seattle to pursue a master's in Human Centered Design & Engineering from the University of Washington.",
  },
  {
    category: "travel",
    date: "2019",
    title: "Mountains of India",
    description: "Took a solo trip to do parasailing in Bir, Himachal Pradesh.",
  },
  {
    category: "work",
    date: "2019",
    title: "First job as an Automobile Engineer",
    description: "I worked at India's largest motorcycle manufacturing company. My day-to-day role involved maintenance planning for inventory management robots. I witnessed state-of-the-art ASRS (Automated Storage and Retrieval Systems) in action.",
  },
  {
    category: "life",
    date: "2015",
    title: "Moved to Vellore for Undergrad school",
    description: "Stepped out of home, friends, family to pursue my passion for automobiles. My love for cars comes from my dad who taught me ABC: Accelerator, Brake and Clutch. I not only got a degree, I also made friends for life.",
  },
];
