# Hearthstone Library

A sleek, responsive SvelteKit web application to browse Hearthstone cards using the Blizzard public API.  
Users can filter cards, view details, mark favorites, and access protected content via secure login.

## Live Demo

[View Live on Vercel](https://hearthstone-library.vercel.app)

---

## Features

- **Login System** with session cookie
- **Client-side filtering** by:
  - Search (card name)
  - Class
  - Mana cost
  - Favorites
- **Advanced reactivity** with `writable` and `derived` stores
- **Dynamic routing** (`/cards/[id]`)
- **Fully styled** with Tailwind CSS (dark theme by default)
- **Responsive layout** for desktop and mobile
- **External API Integration** with Blizzard Hearthstone API
- **Deployed on Vercel**

---

## Technologies Used

- [SvelteKit](https://kit.svelte.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Blizzard Hearthstone API](https://develop.battle.net/)
- [Vercel Hosting](https://vercel.com)

---

## Setup & Development

```bash
  # Install dependencies
  npm install
```

```bash
  # Start dev server
  npm run dev
```

```bash
  # Build for production
  npm run build
```

## Login Credentials (Demo)

Username: admin  
Password: password123

## File structure

```
src/
│
├── routes/
│   ├── +page.svelte        # Landing page
│   ├── login/              # Login page
│   ├── logout/             # Logout handler
│   └── cards/              # Card browser
│       ├── +page.svelte
│       └── [id]/           # Dynamic card details
│
├── lib/
│   ├── stores/             # Svelte stores (favorites, user, loading)
│   ├── server/             # Auth + Blizzard API functions
│   └── types/              # TypeScript types
└── app.css                 # Tailwind styles
```

## License

MIT - Vasilije Dikic  
Made for the Modern Web/Frontend Framework Course (FH Technikum Wien)
