# Matteo Romano — Photography Portfolio

A modern, minimalist, and responsive photography portfolio website built with **React**, **TypeScript**, and **Vite**. Showcasing high-resolution collections, custom-curated galleries, a masonry grid layout, and an interactive image lightbox, this project is designed to deliver a premium user experience for art photography.

---

## 📷 Features

- **Dynamic Collections Grid**: Displays distinct galleries with custom cover images and lazy-loaded assets.
- **Masonry Layout & Lightbox**: Sub-project pages feature a responsive masonry gallery with an immersive, full-screen lightbox supporting keyboard and touch navigation.
- **Single Page App Routing**: Clean URL hash routing (`#work`, `#about`, `#contact`, and project-specific URLs like `#michela-donnino`).
- **Contact Form**: An interactive contact interface with real-time feedback.
- **Automatic Metadata Generation**: Scan and update photo collections instantly using the custom scanner script.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) (v18)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (focused on layout transitions, custom easing, and premium dark/light responsive design)

---

## 📂 Project Structure

```text
├── public/                 # Static assets (images, photography projects)
│   └── projects/           # Folders corresponding to each photography project
├── src/
│   ├── components/
│   │   ├── Header.tsx      # Main site navigation and site logo/header
│   │   └── Lightbox.tsx    # Immersive image viewer component
│   ├── App.tsx             # Application router, core pages layout, and state management
│   ├── index.css           # Global typography, color tokens, and layout styles
│   ├── main.tsx            # React application entrypoint
│   └── projectsData.ts     # Auto-generated project catalog metadata
├── setup-projects.cjs      # Node.js build-time script to scan public/projects
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Installation

Clone the repository or open the project folder, then run:

```bash
npm install
```

### 2. Run the Development Server

Start the local server with hot module replacement (HMR):

```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

### 3. Build for Production

Generate an optimized production build in the `dist` directory:

```bash
npm run build
```

You can preview the production build locally with:

```bash
npm run preview
```

---

## 🔄 Dynamic Content Auto-Generation

The project contains a helper utility `setup-projects.cjs` to automatically scan your image folders and construct the typescript data source.

### Adding New Photography Collections

1. Create a new folder inside `public/projects/` named after your collection (e.g. `public/projects/my-new-trip`).
2. Add your high-resolution images (`.jpg`, `.png`, `.webp`, etc.) inside that folder.
3. Run the generator script:
   ```bash
   node setup-projects.cjs
   ```
4. The script will automatically generate the updated list in [projectsData.ts](file:///Users/michelecoppola/Downloads/portfolio/src/projectsData.ts), matching your directory structure.

> [!NOTE]
> If you need to custom-order your projects or override specific cover photos, open [setup-projects.cjs](file:///Users/michelecoppola/Downloads/portfolio/setup-projects.cjs) and edit the `DESIRED_ORDER` array and custom cover image logic under the `main()` function.

---

## 📝 License

This project is private and proprietary. All photographs and code are copyright © Matteo Romano. All rights reserved.
