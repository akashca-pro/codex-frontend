<p align="center">
  <img src="public/codeX-logo.png" alt="CodeX Logo" width="120" height="120" />
</p>

<h1 align="center">CodeX</h1>

<p align="center">
  <strong>Competitive Coding Platform</strong>
</p>

<p align="center">
  Code. Collab. Compete.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#scripts">Scripts</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#license">License</a>
</p>

---

## Overview

**CodeX** is a feature-rich competitive coding platform designed to help developers master Data Structures and Algorithms (DSA). With an integrated code editor, real-time collaboration capabilities, AI-powered hints, and comprehensive progress tracking, CodeX provides everything you need to level up your coding skills.

## Features

### Problem Solving

- Curated collection of DSA problems with varying difficulty levels
- Interactive problem descriptions with examples and constraints
- Multiple programming language support via Monaco Editor
- Real-time code execution and submission validation

### Real-Time Collaboration

- Live collaborative code editor for pair programming
- Real-time cursor tracking and presence indicators
- Shared coding sessions with instant synchronization
- Built with Yjs for conflict-free collaborative editing

### Progress Tracking

- Personal dashboard with submission history
- Visual heatmaps showing coding activity
- Leaderboard rankings to compete with peers
- Streak tracking and performance analytics

### Admin Panel

- Comprehensive problem management (CRUD operations)
- User management and moderation tools
- Platform analytics and statistics dashboard
- Role-based access control

### Authentication

- Secure user authentication with JWT
- Google OAuth integration for quick sign-in
- OTP verification for email confirmation
- Password recovery flow

### Additional Features

- **CodePad**: Standalone code editor for practice and experimentation
- **AI-Powered Hints**: Intelligent hints to guide problem-solving
- **Dark Mode**: Eye-friendly dark theme throughout the platform
- **Responsive Design**: Optimized for desktop and tablet devices

## Tech Stack

### Frontend Framework

| Technology                                    | Purpose                 |
| --------------------------------------------- | ----------------------- |
| [React 19](https://react.dev/)                | UI Library              |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety             |
| [Vite](https://vitejs.dev/)                   | Build Tool & Dev Server |

### State Management

| Technology                                              | Purpose                 |
| ------------------------------------------------------- | ----------------------- |
| [Redux Toolkit](https://redux-toolkit.js.org/)          | Global State Management |
| [Redux Persist](https://github.com/rt2zz/redux-persist) | State Persistence       |
| [React Hook Form](https://react-hook-form.com/)         | Form State Management   |

### UI & Styling

| Technology                                      | Purpose                  |
| ----------------------------------------------- | ------------------------ |
| [Tailwind CSS](https://tailwindcss.com/)        | Utility-First CSS        |
| [Radix UI](https://www.radix-ui.com/)           | Accessible UI Primitives |
| [Framer Motion](https://www.framer.com/motion/) | Animations               |
| [Lucide React](https://lucide.dev/)             | Icons                    |

### Code Editor

| Technology                                                   | Purpose                      |
| ------------------------------------------------------------ | ---------------------------- |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/)  | Code Editor (VS Code Engine) |
| [Monaco Themes](https://www.npmjs.com/package/monaco-themes) | Editor Theming               |

### Real-Time Collaboration

| Technology                                  | Purpose                  |
| ------------------------------------------- | ------------------------ |
| [Socket.IO Client](https://socket.io/)      | WebSocket Communication  |
| [Yjs](https://yjs.dev/)                     | CRDT for Collaboration   |
| [y-monaco](https://github.com/yjs/y-monaco) | Monaco + Yjs Integration |

### Utilities

| Technology                              | Purpose             |
| --------------------------------------- | ------------------- |
| [Zod](https://zod.dev/)                 | Schema Validation   |
| [date-fns](https://date-fns.org/)       | Date Manipulation   |
| [Recharts](https://recharts.org/)       | Data Visualization  |
| [Sonner](https://sonner.emilkowal.ski/) | Toast Notifications |

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22.x
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/codex-react.git
   cd codex-react
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_SOCKET_URL=http://localhost:3001
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173`

## Project Structure

```
codex-react/
├── public/                    # Static assets
│   └── codeX-logo.png         # Application logo
├── src/
│   ├── apis/                  # API service modules
│   │   ├── auth-user/         # Authentication APIs
│   │   ├── codepad/           # CodePad APIs
│   │   ├── collab/            # Collaboration APIs
│   │   ├── dashboard/         # Dashboard APIs
│   │   ├── leaderboard/       # Leaderboard APIs
│   │   └── problem/           # Problem APIs
│   │
│   ├── components/            # Reusable components
│   │   ├── ui/                # UI primitives (shadcn/ui)
│   │   ├── protectors/        # Route guards
│   │   ├── Navbar.tsx         # Navigation component
│   │   ├── MonacoEditor.tsx   # Code editor wrapper
│   │   └── ...
│   │
│   ├── features/              # Feature modules
│   │   ├── admin/             # Admin panel features
│   │   ├── auth/              # Authentication features
│   │   ├── CodePad/           # Standalone code editor
│   │   ├── collaboration/     # Real-time collaboration
│   │   ├── landing/           # Landing page
│   │   ├── problems/          # Problem solving
│   │   └── user/              # User dashboard & profile
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── store/                 # Redux store configuration
│   │   ├── slices/            # Redux slices
│   │   └── rtk-query/         # RTK Query APIs
│   │
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   ├── main.tsx               # Application entry point
│   └── App.tsx                # Root component
│
├── index.html                 # HTML template
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── vercel.json                # Vercel deployment config
```

## Environment Variables

| Variable                | Description            | Required |
| ----------------------- | ---------------------- | -------- |
| `VITE_API_BASE_URL`     | Backend API base URL   | Yes      |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes      |
| `VITE_SOCKET_URL`       | WebSocket server URL   | Yes      |

### Environment Files

- `.env.local` - Local development environment
- `.env.production` - Production environment

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start development server with HMR |
| `npm run build`   | Build for production              |
| `npm run preview` | Preview production build locally  |
| `npm run lint`    | Run ESLint for code quality       |

## Deployment

### Vercel (Recommended)

This project includes a `vercel.json` configuration for seamless deployment:

1. **Connect your repository to Vercel**
2. **Set environment variables** in the Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service (Netlify, AWS S3, etc.)

### Docker (Optional)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## API Integration

This frontend is designed to work with the **CodeX Microservices Backend**. Ensure the following services are running:

- **Gateway Service** - API Gateway & Authentication
- **Problem Service** - Problem management
- **Code Execution Service** - Code compilation & execution
- **Collaboration Service** - Real-time collaboration

## Browser Support

| Browser          | Supported |
| ---------------- | --------- |
| Chrome (latest)  | Yes       |
| Firefox (latest) | Yes       |
| Safari (latest)  | Yes       |
| Edge (latest)    | Yes       |

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `npm run lint` before committing
- Write meaningful commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with care by the CodeX Team
</p>

<p align="center">
  <a href="#codex">Back to Top</a>
</p>
