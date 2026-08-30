export const coverageSites = [
  {
    id: "drv",
    code: "DRV",
    name: "Deer Valley",
    descriptor: "Antioch / Deer Valley MA–MD pods",
    pods: [
      {
        number: 1,
        mas: ["Adriana", "George"],
        maNote: "Adriana · 3 days/week",
        providers: [
          { name: "Suk Seo", photo: "suk-seo.webp" },
          { name: "Maureen Morgan", photo: "maureen-morgan.webp" },
          { name: "Dan Chung", photo: "dan-chung.webp" },
          { name: "Erina Foster", photo: "erina-foster.webp" },
        ],
        schedule: [
          { name: "Adriana", days: "Tue · Wed · Thu" },
          { name: "George", days: "Mon PM · Wed PM · Fri", label: "Float" },
        ],
      },
      {
        number: 2,
        mas: ["Elizabeth Sanchez"],
        providers: [
          { name: "Courtney Gonzales", photo: "courtney-gonzales.webp" },
          { name: "Arun Suryaprasad", photo: "arun-suryaprasad.webp" },
          { name: "Roshan Patel", photo: "roshan-patel.webp" },
          { name: "Kay Ozeki", photo: "kay-ozeki.webp" },
        ],
        schedule: [
          { name: "Elizabeth Sanchez", days: "Mon · Tue · Thu · Fri", note: "32 hours · off Wednesday" },
        ],
      },
      {
        number: 3,
        mas: ["David", "Marci"],
        maNote: "David · 3 days/week",
        providers: [
          { name: "Patrick McKenzie", photo: "patrick-mckenzie.webp" },
          { name: "Simon Chan", photo: "simon-chan.webp" },
          { name: "Omar Al-Shuwaykh", photo: "omar-al-shuwaykh.webp", tag: "New" },
          { name: "Sabrina Han", initials: "SH", role: "PA" },
        ],
        schedule: [
          { name: "David", days: "Wed · Thu · Fri" },
        ],
      },
    ],
    support: [
      { label: "On-call", people: ["Anarosa Mejia", "Camila Gomez"] },
      { label: "Additional", people: ["Sabrina Han, PA"] },
    ],
  },
  {
    id: "wcr",
    code: "WCR",
    name: "Walnut Creek",
    descriptor: "Walnut Creek MA–MD pods",
    pods: [
      {
        number: 1,
        mas: ["Regina"],
        providers: [
          { name: "Steve Cheng", photo: "steve-cheng.webp" },
          { name: "Ahilan Arulanandan", photo: "ahilan-arulanandan.webp" },
          { name: "Ed Ouyang", photo: "ed-ouyang.webp" },
          { name: "Kirsten Regalia", photo: "kirsten-regalia.webp" },
          { name: "T.R. Levin", photo: "tr-levin.webp", role: "Pathology only" },
        ],
        schedule: [
          { name: "Regina", days: "Friday PM off" },
        ],
      },
      {
        number: 2,
        mas: ["Joanna", "Vanessa"],
        providers: [
          { name: "Liz Clark", photo: "liz-clark.webp" },
          { name: "Anish Patel", photo: "anish-patel.webp" },
          {
            name: "Tom Haddad",
            photo: "tom-haddad.webp",
            transition: { name: "Aysha Aslam", initials: "AA", tag: "New" },
          },
          { name: "Jay Garuda", photo: "jay-garuda.webp" },
        ],
        schedule: [
          { name: "Marissa", days: "Mon · Tue AM · Fri", label: "Coverage" },
          { name: "Joanna", days: "Tue · Wed · Thu" },
        ],
      },
      {
        number: 3,
        mas: ["Jessica", "Natalie"],
        providers: [
          { name: "Ying Wang", photo: "ying-wang.webp" },
          { name: "Jag Mathur", photo: "jag-mathur.webp" },
          { name: "Sammy Tesfay", photo: "sammy-tesfay.webp" },
          { name: "Mariel Bailey", photo: "mariel-bailey.webp" },
        ],
        schedule: [
          { name: "Jessica", days: "Mon · Tue · Wed · alt Thu · Fri" },
        ],
      },
    ],
    support: [
      { label: "Additional PAs", people: ["Robbie Molden", "Megan Palsa"], note: "Shared across MAs" },
    ],
  },
];
