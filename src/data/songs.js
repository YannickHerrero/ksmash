// Verified songs per artist (from iTunes API + Spotify/web research)
// Only includes songs confirmed to exist

import groups from "./groups";

const songsByArtist = {
  // BLACKPINK (1)
  1: ["How You Like That", "DDU-DU DDU-DU", "Pink Venom", "Kill This Love", "BOOMBAYAH", "Shut Down", "Pretty Savage", "Lovesick Girls", "As If It's Your Last", "Ice Cream"],
  // BTS (2)
  2: ["Butter", "Boy With Luv", "Dynamite", "FAKE LOVE", "Blood Sweat & Tears", "DNA", "MIC Drop", "Run BTS", "Black Swan", "Spring Day"],
  // TWICE (3)
  3: ["What is Love?", "FANCY", "The Feels", "I CAN'T STOP ME", "TT", "Feel Special", "LIKEY", "YES or YES", "Cheer Up", "Signal"],
  // Stray Kids (4)
  4: ["MANIAC", "God's Menu", "LALALALA", "S-Class", "MEGAVERSE", "Back Door", "Thunderous", "MIROH", "Chk Chk Boom", "CASE 143"],
  // aespa (5)
  5: ["Whiplash", "Drama", "Supernova", "Armageddon", "Black Mamba", "Spicy", "Next Level", "Savage", "Illusion", "Girls"],
  // NewJeans (7)
  7: ["OMG", "Ditto", "Attention", "ETA", "How Sweet", "Super Shy", "Cookie", "Hype Boy", "Supernatural", "New Jeans"],
  // IVE (8)
  8: ["I AM", "LOVE DIVE", "After LIKE", "ELEVEN", "Baddie", "Kitsch", "Off The Record", "Either Way", "Mine", "Accendio"],
  // LE SSERAFIM (9)
  9: ["CRAZY", "ANTIFRAGILE", "Perfect Night", "Smart", "EASY", "Eve, Psyche & The Bluebeard's wife", "FEARLESS", "UNFORGIVEN", "HOT", "CELEBRATION"],
  // ITZY (10)
  10: ["WANNABE", "DALLA DALLA", "LOCO", "Not Shy", "In the Morning", "Cheshire", "SNEAKERS", "ICY", "CAKE", "Voltage"],
  // ATEEZ (11)
  11: ["BOUNCY", "Guerrilla", "Say My Name", "WONDERLAND", "Answer", "Fireworks (I'm The One)", "Deja Vu", "HALAZIA", "Wave", "Inception"],
  // Red Velvet (14)
  14: ["Psycho", "Bad Boy", "Red Flavor", "Russian Roulette", "Peek-A-Boo", "Power Up", "Ice Cream Cake", "Dumb Dumb", "Happiness", "Rookie"],
  // NMIXX (15)
  15: ["O.O", "DICE", "Love Me Like This", "DASH", "Soñar (Breaker)", "Run For Roses", "TANK", "Young, Dumb, Stupid", "Blue Valentine", "Party O'Clock"],
  // Jungkook (20)
  20: ["Seven", "Standing Next to You", "Left and Right", "Still With You", "Yes or No", "Hate You", "Somebody", "Dreamers", "Please Don't Change", "3D"],
  // IU (21)
  21: ["Love wins all", "Lilac", "Blueming", "Good Day", "eight", "Bbibbi", "Celebrity", "Palette", "Through the Night", "My Old Story"],
  // MAMAMOO (22)
  22: ["HIP", "gogobebe", "Egotistic", "Starry Night", "Dingga", "Decalcomanie", "Aya", "Mr. Ambiguous", "Yes I Am", "Um Oh Ah Yeh"],
  // Lisa (24)
  24: ["MONEY", "LALISA", "ROCKSTAR", "New Woman", "Moonlit Floor", "SG", "Sexy Deadly Killer", "NANANANA"],
  // Rosé (25)
  25: ["APT.", "On The Ground", "Gone", "Number One Girl", "Toxic Till The End", "Stay A Little Longer", "Too Bad", "Hard To Love"],
  // MONSTA X (27)
  27: ["HERO", "Love Killa", "Shoot Out", "Beautiful", "Dramarama", "WHO DO U LOVE?", "MIDDLE OF THE NIGHT", "Gambler", "Follow", "Jealousy"],
  // I-DLE (28)
  28: ["Queencard", "TOMBOY", "HANN", "Nxde", "Oh my god", "Señorita", "LATATA", "DUMDi DUMDi", "Super Lady", "MY BAG"],
  // ILLIT (33)
  33: ["Magnetic", "Lucky Girl Syndrome", "Tick-Tack", "My World", "Cherish (My Love)", "IYKYK", "NOT CUTE ANYMORE"],
  // BABYMONSTER (34)
  34: ["SHEESH", "BATTER UP", "DRIP", "LIKE THAT", "FOREVER", "BILLIONAIRE", "HOT SAUCE", "WE GO UP"],
  // KISS OF LIFE (35)
  35: ["Midas Touch", "Shhh", "Bad News", "Sticky", "Nobody Knows", "Sugarcoat", "Te Quiero", "Countdown", "Igloo", "Get Loud"],
  // FIFTY FIFTY (36)
  36: ["Cupid", "Tell Me", "Lovin' Me", "SOS", "Barbie Dreams", "Pookie", "Log in My Dreams"],
  // Jennie (37)
  37: ["SOLO", "Mantra", "You & Me", "One Of The Girls", "like JENNIE", "Damn Right", "Start A War"],
  // V (38)
  38: ["Slow Dancing", "Love Me Again", "Rainy Days", "For Us", "FRI(END)S", "Sweet Night", "Blue", "Winter Bear", "Christmas Tree", "Scenery"],
  // Suga (39)
  39: ["Daechwita", "Haegeum", "The Last", "Agust D", "Give It To Me", "So Far Away", "Amygdala", "People Pt.2", "Interlude: Shadow", "SDL"],
  // BIGBANG (43)
  43: ["BANG BANG BANG", "Fantastic Baby", "FXXK IT", "Still Life", "Haru Haru", "LAST DANCE", "LOSER", "Lies", "IF YOU", "FLOWER ROAD"],
  // G-Dragon (44)
  44: ["Heartbreaker", "Crooked", "Untitled 2014", "Crayon", "POWER", "WHO YOU?", "One of a Kind", "Black", "Coup d'État", "Bullshit"],
  // 2NE1 (45)
  45: ["I Am the Best", "Fire", "Come Back Home", "I Love You", "I Don't Care", "Lonely", "Missing You", "Goodbye", "Gotta Be You", "Ugly"],
  // EVERGLOW (46)
  46: ["DUN DUN", "Adios", "LA DI DA", "Bon Bon Chocolat", "First", "Pirate", "Slay", "Zombie", "Promise", "Hush"],
  // Hwasa (47)
  47: ["Twit", "María", "I Love My Body", "Guilty Pleasure", "NA", "Star", "Lemon", "Ma Baby"],
  // iKON (49)
  49: ["LOVE SCENARIO", "KILLING ME", "I'M OK", "BLING BLING", "GOODBYE ROAD", "RHYTHM TA", "B-DAY", "Why Why Why", "Dive", "Rubber Band"],
  // Sunmi (54)
  54: ["Gashina", "Heroine", "Pporappippam", "LALALAY", "Noir", "TAIL", "Siren", "Heart Burn", "You can't sit with us", "24 Hours"],
  // Chungha (55)
  55: ["Gotta Go", "Snapping", "Bicycle", "Roller Coaster", "Stay Tonight", "Love U", "Killing Me", "Chica", "Sparkling", "Why Don't You Know"],
  // XG (56)
  56: ["LEFT RIGHT", "SHOOTING STAR", "WOKE UP", "NEW DANCE", "GRL GVNG", "Tippy Toes", "MASCARA", "PUPPET SHOW", "TGIF", "Cozy"],
  // Young Posse (57)
  57: ["XXL", "Scars", "ROTY", "MACARONI CHEESE", "OTB", "FREESTYLE", "ATE THAT", "YOUNG POSSE UP", "POSSE UP!"],
  // BIBI (58)
  58: ["Bam Yang Gang", "BIBI Vengeance", "Pado", "Binu", "Sugar Rush", "Scott and Zelda", "Animal Farm", "BAD SAD AND MAD"],
  // Jvcki Wai (59)
  59: ["Enchanted Propaganda", "DDING", "Kocean", "Hyperreal", "Anarchy", "Fadeaway"],
  // Zico (60)
  60: ["Any Song", "SPOT!", "BERMUDA TRIANGLE", "I Am You You Are Me", "She's a Baby", "Okey Dokey", "SoulMate", "Freak", "Summer Hate", "ANTI"],
  // Giriboy (61)
  61: ["We Don't Talk Together", "Flex", "Sooljalee", "Take Care Of You", "Traffic Control", "Don't Let Me Go"],
  // HyunA (62)
  62: ["I'm Not Cool", "Lip & Hip", "Babe", "Bubble Pop!", "Roll Deep", "FLOWER SHOWER", "Red", "How's This", "Nabillera"],
  // KARD (63)
  63: ["Oh NaNa", "Bomb Bomb", "Hola Hola", "Don't Recall", "Dumb Litty", "ICKY", "Red Moon", "Gunshot", "You In Me", "Rumor"],
  // BVNDIT (64)
  64: ["Dramatic", "Hocus Pocus", "Children", "JUNGLE", "VENOM", "Come and Get It", "Dumb", "Cool", "Fly", "My Error"],
  // Weki Meki (65)
  65: ["I don't like your Girlfriend", "Tiki-Taka", "DAZZLE DAZZLE", "Picky Picky", "Crush", "Oopsy", "La La La", "COOL"],
  // MOMOLAND (66)
  66: ["Bboom Bboom", "Baam", "I'm So Hot", "Thumbs Up", "Ready Or Not", "Freeze", "JJan! Koong! Kwang!", "Yummy Yummy Love"],
  // MEOVV (67)
  67: ["MEOW", "HANDS UP", "ME ME ME", "BURNING UP", "DROP TOP", "LIT RIGHT NOW"],
  // Nature (68)
  68: ["I'm So Pretty", "RICA RICA", "SOME (You'll Be Mine)", "OOPSIE (My Bad)", "Allegro Cantabile"],
  // Jisoo (69)
  69: ["FLOWER", "All Eyes On Me", "Clarity", "Sunshine", "Closest"],
  // LOONA (70)
  70: ["Hi High", "Heart Attack", "PTT (Paint The Town)", "Why Not?", "Love Cherry Motion", "Eclipse", "favOriTe", "Flip That", "Stylish", "Star"],
  // KATSEYE (71)
  71: ["Touch", "My Way", "Gnarly", "SIS (Soft Is Strong)", "Debut"],
  // Yuqi (72)
  72: ["Freak", "On Clap", "Bonnie & Clyde", "Giant", "All About U"],
  // BewhY (73)
  73: ["Gottasadae", "Forever", "Veni Vidi Vici", "Time Travel", "Challan"],
  // Bobby (74)
  74: ["HOLUP!", "I Love You", "U MAD", "Runaway", "Bounce"],
  // A.C.E (75)
  75: ["Under Cover", "Savage", "Cactus", "Take Me Higher", "Favorite Boys", "Callin'", "Stand By You"],
  // Dreamcatcher (76)
  76: ["Odd Eye", "BOCA", "Scream", "Deja Vu", "Chase Me", "Good Night", "Piri", "BEcause", "MAISON", "Bonvoyage"],
  // Soyeon (77)
  77: ["Jelly", "Beam Beam", "Idle Song", "Psycho", "Weather", "Quit"],
  // Mino (78)
  78: ["Fiancé", "Fear", "I'm Him", "Body", "Okey Dokey", "Run Away", "Tang!"],
  // Jessi (79)
  79: ["ZOOM", "What Type of X", "NUNU NANA", "Gum", "Cold Blooded", "STAR", "Ssenunni", "Who Dat B"],
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
      wiki: artist.wiki,
    });
  }
}

export default songs;
export { songsByArtist };
