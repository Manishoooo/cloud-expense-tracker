# Cloud Expense Tracker

A simple personal expense tracker built for a college cloud computing project. Users can sign up, log in, and add, view, edit, delete, search, filter and categorize their daily expenses in INR (₹). Data is stored in the cloud (Cloud Firestore) and each user can only access their own expenses.

If Firebase is not configured, the app runs in **demo mode** using the browser's localStorage, so you can try it without any cloud setup.

## Features

- Email/password registration and login (Firebase Authentication)
- Add, edit and delete expenses (title, amount in ₹, category, date, optional description)
- Confirmation dialog before deleting
- Dashboard: total expenses, number of transactions, current month's spending
- Category-wise spending chart (Recharts donut chart)
- Search by title; filter by category and date range
- Form validation, loading states, friendly error and empty states
- Responsive layout: sidebar on desktop, bottom navigation on mobile
- Demo mode that works offline with no Firebase account

## Technology stack

| Part | Technology |
| --- | --- |
| Frontend | React + Vite (JavaScript) |
| Styling | Plain CSS |
| Chart | Recharts |
| Authentication | Firebase Authentication (email/password) |
| Database | Cloud Firestore |
| Hosting | Firebase Hosting |
| Version control | Git and GitHub |

## Architecture

```
Browser (React app)
   |-- Firebase Authentication  -> who is the user? (uid)
   |-- Cloud Firestore          -> users/{uid}/expenses/{expenseId}
   |        ^
   |        '-- Security rules (firestore.rules) allow access only when request.auth.uid == {uid}
   '-- Hosted on Firebase Hosting (static files from the "dist" folder)
```

The UI never talks to Firebase directly. All database and login code lives in `src/services/`, which makes the app easy to explain:

```
cloud-expense-tracker/
├── public/favicon.svg
├── src/
│   ├── components/      Reusable UI pieces (form, table, chart, filters, dialogs...)
│   ├── pages/           LoginPage, DashboardPage, ExpensesPage
│   ├── services/
│   │   ├── firebase.js        Reads .env and initialises Firebase (if configured)
│   │   ├── authService.js     Register / login / logout
│   │   └── expenseService.js  Add / edit / delete / listen (Firestore or localStorage demo)
│   ├── utils/helpers.js       Categories, INR formatting, validation, error messages
│   ├── App.jsx                Main logic and layout
│   ├── main.jsx               Entry point
│   └── index.css              All styles
├── .env.example     Template for Firebase settings
├── .gitignore
├── firebase.json    Hosting + Firestore rules configuration
├── firestore.rules  Security rules
├── index.html
├── package.json
└── vite.config.js
```

## Run locally (demo mode, no Firebase needed)

Requirements: [Node.js](https://nodejs.org) 20.19 or newer.

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually http://localhost:5173). With no `.env` file the app starts in **demo mode**:

- A yellow banner says "Demo mode".
- Expenses are stored **only in the current browser (localStorage)**. They are not in the cloud and disappear if you clear browser data or use another browser.
- Click **Load sample data** on the empty screen to see the dashboard filled in.

## Firebase setup (cloud mode)

1. Go to the [Firebase console](https://console.firebase.google.com) and click **Add project**.
2. **Authentication**: Build > Authentication > Get started > Sign-in method > enable **Email/Password**.
3. **Firestore**: Build > Firestore Database > Create database. Choose a location (for example `asia-south1` for Mumbai). Either mode is fine, because the rules in this repo replace the starting rules.
4. **Web app config**: Project settings (gear icon) > General > Your apps > click the web icon `</>` > register the app (skip Firebase Hosting for now). Copy the `firebaseConfig` values.
5. Create your environment file:
   ```bash
   cp .env.example .env        # Windows PowerShell: copy .env.example .env
   ```
   Paste your values into `.env`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
6. Install the Firebase CLI, log in and link the project:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add          # choose your project and give it the alias "default"
   ```
7. **Deploy the security rules (required)**:
   ```bash
   firebase deploy --only firestore:rules
   ```
8. Restart the dev server (`npm run dev`). You will now see the login page. Create an account and add an expense. Check the Firebase console > Firestore to see `users/<uid>/expenses`.

Without step 7, Firestore may reject every request (or, if left in test mode, allow everyone access), so always deploy the rules.

### About security

- The Firebase web configuration in `.env` is **public by design**. It only identifies your Firebase project and is visible to anyone who opens the deployed site. It is **not** a secret and **not** a substitute for security.
- Real protection comes from `firestore.rules`, which Firebase enforces on its servers:
  - A user can read, create, update and delete only `users/{their own uid}/expenses/*`.
  - Everything else is denied.
  - Writes are validated (title, amount, category, date format, description length, allowed fields only).
- `.env` is listed in `.gitignore`, so it is not pushed to GitHub. Never commit service account keys or admin credentials. This project does not use any.
- If Firebase is configured and a database call fails, the app shows an error. It does **not** silently switch to localStorage.

## Build and deploy to Firebase Hosting

```bash
npm run build                 # creates the "dist" folder (reads your .env)
firebase deploy               # deploys hosting + Firestore rules
```

Or deploy only the website: `firebase deploy --only hosting`.

Firebase prints a Hosting URL like `https://your-project-id.web.app`. Vite embeds the `.env` values at build time, so run `npm run build` on a machine that has your `.env` file.

Preview the production build locally with `npm run preview`.

## Upload to GitHub

1. On github.com click **New repository**, name it `cloud-expense-tracker`, leave it empty (no README or .gitignore) and click **Create repository**.
2. Copy the repository URL, then run in the project folder:

```bash
git init
git add .
git commit -m "Initial commit: Cloud Expense Tracker"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Before pushing, run `git status` and confirm `.env` is **not** listed.

## Screenshots

Add your own screenshots to a `screenshots/` folder and reference them here:

| Dashboard | Expenses | Mobile |
| --- | --- | --- |
| `screenshots/dashboard.png` | `screenshots/expenses.png` | `screenshots/mobile.png` |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| App shows "Demo mode" even after adding `.env` | Check the file is named exactly `.env`, values do not start with `your-`, then restart `npm run dev`. |
| "Permission denied" message | Run `firebase deploy --only firestore:rules` and make sure you are logged in. |
| "Email/password sign-in is not enabled" | Enable Email/Password in Firebase console > Authentication > Sign-in method. |
| "Firestore is not ready" message | Create the Firestore database in the Firebase console. |
| Deployed site shows demo mode | The `.env` file was missing when you ran `npm run build`. Add it and build again. |
| `firebase` command not found | Run `npm install -g firebase-tools`. |

## Presentation talking points

- **Why cloud?** Data lives in Firestore, so a user can log in from any device. Firebase Hosting serves the app on a global CDN with HTTPS.
- **Serverless:** no server to manage. Authentication, database and hosting are managed services (BaaS).
- **Security:** each document path contains the owner's uid, and the rules compare it to the logged-in uid.
- **Real-time:** `onSnapshot` updates the list automatically when data changes.
- **Demo mode:** the service layer swaps Firestore for localStorage, so the UI code is identical in both modes.

## Limitations

- Single currency (INR), no budgets, no export, no recurring expenses (kept small on purpose).
- Demo-mode data is local to one browser.
- No password reset screen (can be added with Firebase's `sendPasswordResetEmail`).
