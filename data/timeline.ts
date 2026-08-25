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
  // One or more photos rendered under the header. Drop image files in
  // public/images/about/ and reference them here, e.g.
  // photos: [{ src: "/images/about/oaxaca.jpg", alt: "Oaxaca courtyard" }]
  photos?: {
    src: string;
    alt: string;
  }[];
};

export const timeline: TimelineEntry[] = [
  
  {
    category: "life",
    date: "2040???",
    title: "Coffee, CrossFit & Cocktail",
    description: "I think about where I would want to be in the next phase of my life and I picture myself in a smaller town enjoying my coffee before the WOD and later shaking cocktails behind the bar. ",
  },
  {
    category: "work",
    date: "2026",
    title: "Sam Stephenson, Ryo, and Soleio",
    description: "I saw Sam for the first time on the Dive Club podcast — I remember the next 48 hrs obsessing over everything he said about being a designer and design. Someday I hope to meet him in person. I saw Soleio baba at South Park Commons (hoping someday he will read 'baba' on my portfolio and get a good laugh). Knowing Sam, Ryo, and Soleio has been enlightening for my design journey.",
  },
  {
    category: "life",
    date: "2024",
    title: "Chalk up",
    description: "The day I hit 100kgs on the weighing scale, I knew I had ignored my health for way too long. I looked for the nearest gym which happened to be a CrossFit gym. Since then, I have dedicated time and energy to getting good at CrossFit.",
  },
  {
    category: "travel",
    date: "2025",
    title: "solo trip to Portugal",
    description: "Once in a while, I like spending time by myself, read a book, learn a new skill - I learnt surfing in Portugal.",
  },
  {
    category: "travel",
    date: "2023",
    title: "Oaxaca",
    description: "Spent 3 weeks in Oaxaca Centro in a co-living space, connecting with strangers, exchanged gifts for Christmas and it didn't matter what each of us did for a living. Connections were made over coffee and I embraced different cultures over shared meals.",
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
    description: "Experienced early life crisis so took a trip to do parasailing in Bir (from 8400ft elevation), Himachal Pradesh.",
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
