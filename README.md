# KSMASH

Find your ultimate K-pop bias through head-to-head battles.

KSMASH pits K-pop groups and soloists against each other two at a time and uses
your picks to build a personal ranking. The more rounds you play, the more
accurate the ranking gets.

## How it works

- **Head-to-head matchups.** Pick the group or soloist you prefer between two options.
- **ELO ratings.** Each pick updates ratings using an ELO model with an adaptive
  K-factor — early wins move the needle more, so the ranking takes shape quickly.
- **Discovery first, then ladder matches.** Early matchups prioritize artists you
  haven't seen yet. Once you've made enough comparisons, top-ranked artists start
  facing each other to refine the leaderboard.
- **Live ranking.** After 50 comparisons you can stop any time and see your full
  ranked list, or keep going to sharpen the order.

The ranking engine lives in [`src/engine/ranking.js`](src/engine/ranking.js) and the
roster in [`src/data/groups.js`](src/data/groups.js). Artist images are pulled from
the Wikipedia API at runtime — no images are bundled with the app.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Other scripts

```bash
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Tech stack

- React 19
- Vite
- Tailwind CSS 4
- Wikipedia REST API for artist images

## Contributing

Contributions are welcome. The roster in `src/data/groups.js` is the easiest place
to start — add or update groups and soloists, making sure the `wiki` slug matches
the article title on English Wikipedia.

## License

MIT
