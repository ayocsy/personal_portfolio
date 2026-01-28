
export type WindowBodyItem =
  | string
  | { type: "image"; src: string; alt: string }
  | { type: "link"; href: string; label: string };

export const WINDOW_CONTENT: Record<string, { title: string; body: WindowBodyItem[] }> = {
  about: {
    title: "About Me",
    body: [
      "Hallo World!",
      "I’m Gaster Chiang, a Software Engineering student at UQ, with a focus on AI and building things that actually get used. I’m really interested in the full-stack development, AI agents, and software systems. I love how much real-world impact good software can have — there’s nothing better than seeing something you built being used by real people. If you are interested to see some of the things I have built, you could check out the \"Projects\" Folder, it includes web apps and landing pages, data analytics and AI-driven systems, a real-time Mahjong scoreboard, backend server work, and a few fun visual experiments. ",
      "In my free time, I spend a lot of hours bouldering. It’s pure problem-solving and trial-and-error — failing moves, adjusting, and eventually figuring it out. Finally topping a hard problem feels amazing (and yes, it feels exactly like fixing a bug after hours haha).",
      "I’m also the President of the UQ Mahjong Society, where I help run events, organise tournaments, and keep the community active (and competitive). When I’m not coding or climbing, I’m usually thinking about new ideas to build or playing mahjong with friends :P"
]

  },
  system: {
    title: "System",
    body: [
      "Gaster OS v1.0",
      "Battery: 98% OK",
      "Memory: 2048MB OK",
    ],
  },

  projects: {
    title: "Projects",
    body: [
      "Open the project files to see details.",
    ],
  },
  project_pwebsite: {
    title: "Personal Website",
    body: [
      "Built a retro Mac‑OS inspired personal website (Gaster OS) with draggable windows, icons, and folders.",
      "What I did: designed the UI system, built reusable components (Window, Icon, Header, FolderView), and created a custom layout grid.",
      "Engineering: implemented window state, drag constraints, and responsive sizing so it works on desktop + mobile.",
      "Polish: added CRT texture, menu bar interactions, and a boot/loading sequence for atmosphere.",
      "What I learned: managing component state across multiple windows, pointer/touch events, and keeping retro styling consistent.",
      "Next: add project write‑ups, real screenshots, and external links per file.",
      "Screenshots to add:",
      "1) Hero desktop view with a few windows open.",
      "2) Projects folder open (shows the file system metaphor).",
      "3) Window mid‑drag (interaction).",
      "4) Mobile narrow layout (responsiveness).",
      "5) Boot/loading screen (retro vibe).",
    ],
  },
  project_lwebsite: {
    title: "Society landing page",
    body: [
      "Coming soon."
    ],
  },

  project_data: {
    title: "FANNG STOCK Data analystic",
    body: [
      "Coming soon.",
      "Hackathon builds and experiments.",
    ],
  },
  project_face: {
    title: "Face Detection Server",
    body: [
      "Coming soon.",
      "Generative agents framework notes.",
    ],
  },
  project_effect: {
    title: "Cool visual effect",
    body: [
      "Generative agents framework notes.",
    ],
  },

  project_swebsite: {
    title: "scorebaord Website",
    body: [
      "Coming soon.",
      "Generative agents framework notes.",
    ],
  },
  bouldering: {
    title: "Bouldering",
    body: [
      "Some cool outdoor boulders I have done:",
      { type: "image", src: "/assets/Loaf2-01.webp", alt: "Outdoor bouldering photo" },
       "No. 7 Baguette (sds) ** V5: Start compressed and matched on the low flake, then traverse right along the lip of the bloc all the way to the rounded lip above.",
       "It’s a slightly longer boulder problem that requires good endurance. The first half is fairly easy since most of the holds are jugs, the main thing is finding an efficient sequence so you don’t waste too much energy.Once you reach the crux (around the No. 10 position), you’ll need to pull hard and catch the inside cut with your right hand. The cut is pretty far and not very deep, so aim precisely and crimp it firmly. After that, match the cut and reach for the jug next to it. Once you successfully grab the jug, congrats you’ve earned yourself a V5!",
       " ",
      { type: "image", src: "/assets/Dust-01.webp", alt: "Outdoor bouldering photo" },
      "No. 5 二刀流·羅生門 (sds) ** V4: Sit start at the base of the crack and climb this until it is possible to reach out left to a good jug at the start of a horizontal crack. Follow the crack to its end and then mantle to finish.",
      "This boulder is my favourite outdoor problem. Not only is the boulder and the crack beautiful, but the movement is also really fun. For the first half, you need to maintain good body tension and smear on the wall since there are no footholds but the crack is solid and easy to hold so it's not hard to do smearing. When you reach around the No. 4 position, jam your foot into the crack and sit on it, shifting your balance to the left. At the same time, use your right hand to push yourself to left and use your left hand to crimp the small crimp next to the big jug. The jug is super goooood, once your position is comfy enough, you can actually reach it directly. After that, match the jug and use your own way to top out.",
      " ",
      { type: "image", src: "/assets/Stuffing-01-3.webp", alt: "Outdoor bouldering photo" },
      "No. 2 上海姿飯  *** V5: Start matched in the low rail and, using either arête as necessary, work your way up the face to a dynamic finish to go holds on the top right.", 
      "There are 2 ways to do this boulder, you can either do it with the upper or the lower route beta. The difference between them are the upper one require more finger strength and good body tension to go for the top but require less dynamic movement in the end, oppositly, the lower route is a pretty chill slab for the first half but a high ball scary ass dyno in the end. I have done it with the lower route beta. To be honest, even though the dyno in the end is super scary and tall, the top is actually really good to catch. I would say once you conquer the fear and willing to jump, it's pretty easy for V5. Also, the footwork and foot position are pretty important for this boulder, you need to find yourself a comfortable position for the dyno in the end.",
      " ",
      "More details and topo:",
      { type: "link", href: "https://hongkongclimbing.com/blocs/ma-on-shan-bouldering/sisyphus/", label: "Sisyphus – Ma On Shan Bouldering" },
    ]
  },
  Thank_You: {
    title: "Thank you!",
    body: [
      "Special Thanks to XF!!! Check out her instagram \"ickyism\" She makes lots of cool stuff:P "
    ]
  }
};

export const PROJECT_FILES = [
  { name: "Personal Website", label: "personal_website.txt", windowType: "project_pwebsite" },
  { name: "Landing Page", label: "landing_page.txt", windowType: "project_lwebsite" },
  { name: "FANNG Stock Data analystic", label: "stock_data_analystic.txt", windowType: "project_data" },
  { name: "Face detect & replace server", label: "face_detect_server.txt", windowType: "project_face" },
  { name: "Mahjong Scoreboard", label: "scoreboard.txt", windowType: "project_swebsite" },
  { name: "Visual Effect", label: "cool_visual_effect.txt", windowType: "project_effect"}
];
