# Gemini Project Helper: MOOD

This file provides context to the Gemini AI assistant for the MOOD project.

## 1. Project Overview

- **Frameworks:** This is a cross-platform mobile application built with Ionic, React, and Vite.
- **Platform:** It uses Capacitor to target native iOS and Android.
- **UI:** The UI is built with Ionic React components.
- **Language:** The project is written in TypeScript.
- **Authentication:** User authentication is handled by Firebase (Email/Password, Google, Facebook, Phone).
- **Local Storage:** Uses `@ionic/storage` for client-side data persistence.

## 2. Common Commands

- **Start development server:** `npm run dev`
- **Run unit tests:** `npm run test.unit`
- **Run E2E tests:** `npm run test.e2e`
- **Lint the code:** `npm run lint`
- **Create a production build:** `npm run build`
- **Build and open for Android:** `npm run build:android`
- **Build and open for iOS:** `npm run build:ios`

## 3. Project Structure

- `src/pages`: Contains the main pages or screens of the application (e.g., `Home`, `Login`). Each page is a top-level view.
- `src/components`: Contains reusable React components used across different pages.
- `src/services`: Holds business logic and services that interact with external APIs like Firebase (e.g., `authServices.tsx`, `storageService.tsx`).
- `src/interfaces`: Defines TypeScript interfaces for data models (e.g., user data structures).
- `src/theme`: Contains global styling, including CSS variables (`variables.css`).
- `src/App.tsx`: The main application component, responsible for setting up routing.
- `capacitor.config.ts`: Configuration for Capacitor, including native plugin settings.
- `ionic.config.json`: Ionic project configuration file.
- `vite.config.ts`: Vite build configuration.

## 4. Architecture & Conventions

- **Component Style:** Use functional components with React Hooks.
- **Routing:** Handled by `react-router-dom` and `@ionic/react-router`. Routes are defined in `src/App.tsx`.
- **Styling:** Global styles are in `src/theme/variables.css`. Component-specific styles are co-located with their components (e.g., `MyComponent.css`).
- **Services:** Business logic is abstracted into services in the `src/services` directory. These services should be imported into components to be used.
- **State Management:** Primarily uses local component state (`useState`, `useEffect`). For shared state or user data, it relies on services and `@ionic/storage`.
- **Native Features:** Native device features are accessed through Capacitor plugins (e.g., `@capacitor/local-notifications`, `@codetrix-studio/capacitor-google-auth`).
