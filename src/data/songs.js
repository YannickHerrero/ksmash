// Top 10 songs per artist
// Each song maps to its parent artist ID from groups.js

import groups from "./groups";

const songsByArtist = {
  // BLACKPINK (id: 1)
  1: [
    "DDU-DU DDU-DU", "How You Like That", "Pink Venom", "Kill This Love",
    "Lovesick Girls", "Shut Down", "Boombayah", "As If It's Your Last",
    "Playing With Fire", "Whistle",
  ],
  // BTS (id: 2)
  2: [
    "Dynamite", "Butter", "Boy With Luv", "Spring Day",
    "Fake Love", "DNA", "Blood Sweat & Tears", "IDOL",
    "MIC Drop", "Fire",
  ],
  // TWICE (id: 3)
  3: [
    "What is Love?", "Fancy", "Feel Special", "TT",
    "Cheer Up", "I Can't Stop Me", "Talk That Talk", "Likey",
    "Yes or Yes", "Signal",
  ],
  // Stray Kids (id: 4)
  4: [
    "God's Menu", "MANIAC", "Back Door", "Thunderous",
    "S-Class", "MIROH", "Loca", "CASE 143",
    "Hellevator", "District 9",
  ],
  // aespa (id: 5)
  5: [
    "Supernova", "Next Level", "Savage", "Black Mamba",
    "Drama", "Armageddon", "Dreams Come True", "Spicy",
    "Girls", "Whip It",
  ],
  // NewJeans (id: 7)
  7: [
    "Super Shy", "Ditto", "Hype Boy", "OMG",
    "Attention", "ETA", "Cookie", "New Jeans",
    "Hurt", "How Sweet",
  ],
  // IVE (id: 8)
  8: [
    "LOVE DIVE", "After LIKE", "I AM", "Eleven",
    "Kitsch", "Baddie", "Either Way", "Off The Record",
    "Mine", "Accendio",
  ],
  // LE SSERAFIM (id: 9)
  9: [
    "ANTIFRAGILE", "Perfect Night", "FEARLESS", "UNFORGIVEN",
    "Smart", "Eve, Psyche & the Bluebeard's wife", "EASY",
    "Blue Flame", "Impurities", "Good Bones",
  ],
  // ITZY (id: 10)
  10: [
    "WANNABE", "DALLA DALLA", "LOCO", "ICY",
    "SNEAKERS", "Mafia In the Morning", "Not Shy", "CAKE",
    "Cheshire", "Voltage",
  ],
  // ATEEZ (id: 11)
  11: [
    "BOUNCY", "Guerrilla", "WONDERLAND", "Answer",
    "Say My Name", "Fireworks (I'm The One)", "Deja Vu", "HALAZIA",
    "Wave", "Inception",
  ],
  // Red Velvet (id: 14)
  14: [
    "Psycho", "Bad Boy", "Red Flavor", "Peek-A-Boo",
    "Russian Roulette", "Queendom", "Power Up", "Dumb Dumb",
    "Ice Cream Cake", "Feel My Rhythm",
  ],
  // NMIXX (id: 15)
  15: [
    "O.O", "DASH", "Love Me Like This", "Party O'Clock",
    "Soñar (Breaker)", "DICE", "Young, Dumb, Stupid", "Run For Roses",
    "See That?", "PAXXWORD",
  ],
  // Jungkook (id: 20)
  20: [
    "Seven", "Standing Next to You", "Dreamers", "3D",
    "Still With You", "Euphoria", "Left and Right", "My You",
    "Yes or No", "Hate You",
  ],
  // IU (id: 21)
  21: [
    "Blueming", "Love Poem", "Celebrity", "eight",
    "Palette", "Good Day", "Through the Night", "LILAC",
    "Above the Time", "You & I",
  ],
  // MAMAMOO (id: 22)
  22: [
    "HIP", "Gogobebe", "Starry Night", "Decalcomanie",
    "You're the Best", "AYA", "Egotistic", "Wind Flower",
    "Um Oh Ah Yeh", "Piano Man",
  ],
  // Lisa (id: 24)
  24: [
    "LALISA", "MONEY", "ROCKSTAR", "New Woman",
    "Moonlit Floor", "SG", "Tik Tok", "Swallow",
    "Leave It All Behind", "Sexy Girl",
  ],
  // Rosé (id: 25)
  25: [
    "APT.", "On The Ground", "Gone", "toxic till the end",
    "number one girl", "GONE", "Not the Same", "Too Bad For Us",
    "Two Years", "drinks or coffee",
  ],
  // MONSTA X (id: 27)
  27: [
    "Shoot Out", "Love Killa", "Hero", "Jealousy",
    "Gambler", "Beautiful", "Dramarama", "Rush Hour",
    "Follow", "Alligator",
  ],
  // I-DLE (id: 28)
  28: [
    "Queencard", "TOMBOY", "LATATA", "Nxde",
    "HANN", "Super Lady", "Oh my god", "LION",
    "Uh-Oh", "Senorita",
  ],
  // ILLIT (id: 33)
  33: [
    "Magnetic", "Lucky Girl Syndrome", "My World",
    "Cherish (My Love)", "Midnight Fiction", "TICK-TACK",
    "Pimple", "Sunrise", "Tell Me I'm Pretty", "Memories",
  ],
  // BABYMONSTER (id: 34)
  34: [
    "SHEESH", "Batter Up", "DRIP", "Forever",
    "Like That", "Dream", "Stuck In The Middle",
    "CLIK CLAK", "Monsters (Intro)", "BILLIONAIRE",
  ],
  // KISS OF LIFE (id: 35)
  35: [
    "Midas Touch", "Shhh", "Bad News", "Sticky",
    "Nobody Knows", "Sugarcoat", "Te Quiero", "Get Loud",
    "Igloo", "Gentleman",
  ],
  // FIFTY FIFTY (id: 36)
  36: [
    "Cupid", "Barbie Dreams", "Tell Me", "Lovin' Me",
    "Log in My Dreams", "Gravity", "SOS", "Lucky Me",
    "Higher Than Atlantis", "Run",
  ],
  // Jennie (id: 37)
  37: [
    "SOLO", "You & Me", "One Of The Girls", "Mantra",
    "Damn Right", "Slow Motion", "Like JENNIE", "Zen",
    "Love Hangover", "Letters To Myself",
  ],
  // V (id: 38)
  38: [
    "Slow Dancing", "Love Me Again", "FRI(END)S", "Rainy Days",
    "Christmas Tree", "Scenery", "Winter Bear", "Sweet Night",
    "Blue", "For Us",
  ],
  // Suga (id: 39)
  39: [
    "Daechwita", "Haegeum", "Agust D", "People Pt.2",
    "The Last", "Give It To Me", "D-2", "Amygdala",
    "Interlude: Shadow", "Snooze",
  ],
  // BIGBANG (id: 43)
  43: [
    "BANG BANG BANG", "Fantastic Baby", "Haru Haru", "FXXK IT",
    "Blue", "Bae Bae", "Last Dance", "Loser",
    "SOBER", "Lies",
  ],
  // G-Dragon (id: 44)
  44: [
    "Crooked", "Heartbreaker", "Coup d'Etat", "Untitled, 2014",
    "That XX", "Power", "POWER", "Home",
    "Superstar", "She's Gone",
  ],
  // 2NE1 (id: 45)
  45: [
    "I Am the Best", "Fire", "Come Back Home", "Lonely",
    "Missing You", "Go Away", "I Don't Care", "Ugly",
    "Falling in Love", "Gotta Be You",
  ],
  // EVERGLOW (id: 46)
  46: [
    "DUN DUN", "Adios", "LA DI DA", "Pirate",
    "First", "Bon Bon Chocolat", "Slay", "All My Girls",
    "Untouchable", "No Lie",
  ],
  // Hwasa (id: 47)
  47: [
    "Maria", "I'm a B", "Twit", "Chili",
    "Dumhdurum", "LMM", "Kidding", "Bless U",
    "Don't Give a What", "I Love My Body",
  ],
  // iKON (id: 49)
  49: [
    "Love Scenario", "Killing Me", "Goodbye Road", "I'm OK",
    "Rhythm Ta", "BLING BLING", "Dumb & Dumber", "Why Why Why",
    "But You", "Dive",
  ],
  // Kep1er — removed, skip
  // VIVIZ — removed, skip
  // tripleS — removed, skip
  // Billlie — removed, skip
  // Sunmi (id: 54)
  54: [
    "Gashina", "Heroine", "Siren", "pporappippam",
    "Noir", "Tail", "Lalalay", "Full Moon",
    "24 hours", "Heart Burn",
  ],
  // Chungha (id: 55)
  55: [
    "Gotta Go", "Roller Coaster", "Snapping", "Bicycle",
    "Play", "Querencia", "Stay Tonight", "Love U",
    "Flying on Faith", "Sparkling",
  ],
  // XG (id: 56)
  56: [
    "Tippy Toes", "LEFT RIGHT", "SHOOTING STAR", "GRL GVNG",
    "PUPPET SHOW", "MASCARA", "WOKE UP", "NEW DANCE",
    "HESONOO", "Tricky",
  ],
  // Young Posse (id: 57)
  57: [
    "XXL", "Scars", "ROTY", "Skyline",
    "DND", "Macaroni Cheese", "Blue Dot", "OTB",
    "Young Posse Up", "Freestyle",
  ],
  // BIBI (id: 58)
  58: [
    "JOOGEY", "Animal Farm", "Binu", "BAD SAD AND MAD",
    "Kazino", "The Weekend", "Cigarette and Condom", "Blade",
    "Vengeance", "PADO",
  ],
  // Jvcki Wai (id: 59)
  59: [
    "Fadeaway", "Work Out", "Enchanted Propaganda", "DDING",
    "119 REMIX", "IMJMWDP", "Go Back", "Hyperreal",
    "KOCEAN", "Anarchy",
  ],
  // Zico (id: 60)
  60: [
    "Any Song", "SPOT!", "BERMUDA TRIANGLE", "I Am You, You Are Me",
    "She's a Baby", "Artist", "Tough Cookie", "Boys and Girls",
    "No You Can't", "Eureka",
  ],
  // Giriboy (id: 61)
  61: [
    "We Don't Talk Together", "Fluttering Feelings", "flex",
    "You Look So Good to Me", "Mechanical", "I Don't Know",
    "Sexual Perceptions", "Bad Person", "Madeleine", "Novel",
  ],
  // HyunA (id: 62)
  62: [
    "Bubble Pop!", "RED", "Babe", "I'm Not Cool",
    "Roll Deep", "Lip & Hip", "Ice Cream", "Change",
    "Flower Shower", "Ping Pong",
  ],
  // KARD (id: 63)
  63: [
    "Icky", "Cake", "Don't Recall", "Oh NaNa",
    "Bomb Bomb", "Gunshot", "Red Moon", "Hola Hola",
    "Ring the Alarm", "Dumb Litty",
  ],
  // BVNDIT (id: 64)
  64: [
    "Hocus Pocus", "Dramatic", "Be Ambitious!", "Cool",
    "Children", "Carnival", "Bravado", "Come to This",
    "Ribbon", "VENOM",
  ],
  // Weki Meki (id: 65)
  65: [
    "I Don't Like Your Girlfriend", "Picky Picky", "Tiki-Taka (99%)",
    "La La La", "Cool", "Crush", "Butterfly", "Lucky",
    "CoinciDestiny", "Dazzle Dazzle",
  ],
  // MOMOLAND (id: 66)
  66: [
    "BBoom BBoom", "BAAM", "Ready Or Not", "Banana Chacha",
    "I'm So Hot", "Wonderful Love", "JJan! Koong! Kwang!", "Thumbs Up",
    "Yummy Yummy Love", "Tiki Taka",
  ],
  // MEOVV (id: 67)
  67: [
    "Meow", "Toxic", "Body", "Hands Up",
    "Drop Top", "Burning Up", "Lit Right Now", "ME ME ME",
    "CATITUDE", "WILD",
  ],
  // Nature (id: 68)
  68: [
    "RICA RICA", "I'm So Pretty", "SOME (You'll Be Mine)", "OOPSIE (My Bad)",
    "Allegro Cantabile", "DIVE", "Dream About U", "Bing Bing",
    "Girls and Flowers", "Limbo!",
  ],
  // Jisoo (id: 69)
  69: [
    "FLOWER", "All Eyes On Me", "Clarity", "Sunshine",
    "Closest", "Yuki no Hana", "Liar", "Miss You",
    "Pleasure Is All Mine", "Stay",
  ],
  // LOONA (id: 70)
  70: [
    "Butterfly", "Hi High", "PTT (Paint The Town)", "So What",
    "Why Not?", "Star", "Heart Attack", "Hula Hoop",
    "favOriTe", "Flip That",
  ],
  // KATSEYE (id: 71)
  71: [
    "Touch", "My Way", "Gnarly", "SIS (Soft Is Strong)",
    "Here I Am", "I'll Be Loving You", "Come A Little Closer",
    "Debut", "One Day", "So Happy",
  ],
  // Yuqi (id: 72)
  72: [
    "Freak", "On Clap", "Bonnie & Clyde", "Giant",
    "BTHF", "a]ddICT", "All About U", "Stars",
    "Everytime", "I Feel So Lucky",
  ],
  // BewhY (id: 73)
  73: [
    "Forever", "Gottasadae", "Veni Vidi Vici", "Hollow",
    "Time Travel", "B-BOY", "Downthere", "Blind Star",
    "Come Back Home", "Como Te Llamas",
  ],
  // Bobby (id: 74)
  74: [
    "HOLUP!", "I Love You", "Runaway", "U Mad",
    "Tendae", "I'm Different", "Bounce", "L4L (Lookin' for Luv)",
    "Download", "ALIEN",
  ],
  // A.C.E (id: 75)
  75: [
    "Under Cover", "Savage", "Cactus", "Take Me Higher",
    "Favorite Boys", "Callin'", "Stand By You", "Changer",
    "Slow Dive", "Supernatural",
  ],
  // Dreamcatcher (id: 76)
  76: [
    "Odd Eye", "BOCA", "Scream", "Deja Vu",
    "Chase Me", "Good Night", "Piri", "BEcause",
    "MAISON", "Bonvoyage",
  ],
  // Soyeon (id: 77)
  77: [
    "Jelly", "Beam Beam", "Idle Song", "Is This Bad B****** Number?",
    "Psycho", "Weather", "Quit", "Flame",
    "Hann (Alone in Winter)", "Windy",
  ],
  // Mino (id: 78)
  78: [
    "Fiancé", "Fear", "I'm Him", "Body",
    "Okey Dokey", "Run Away", "Everyday", "Location",
    "Hit Me", "Tang!",
  ],
  // Jessi (id: 79)
  79: [
    "NUNU NANA", "What Type of X", "Cold Blooded", "Drip",
    "Zoom", "Gucci", "Ssenunni", "Who Dat B",
    "Star", "Gum",
  ],
};

// Build flat song list with IDs
let songId = 1;
const songs = [];

for (const [artistId, titles] of Object.entries(songsByArtist)) {
  const artist = groups.find((g) => g.id === Number(artistId));
  if (!artist) continue;

  for (const title of titles) {
    songs.push({
      id: songId++,
      title,
      artistId: artist.id,
      artistName: artist.name,
      wiki: artist.wiki, // reuse artist image for song cards
    });
  }
}

export default songs;
export { songsByArtist };
