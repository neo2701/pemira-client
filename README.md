# 🌐 Pemira Frontend Setup Guide (Nuxt.js)

Hey! Welcome to the setup guide for the Pemira API frontend, built with Nuxt.js. Follow these steps to get everything up and running on your local server.

## 📝 Prerequisites

Before you start, make sure your device has the following:

-   **Node.js**: A recent, stable version (at least version 18.x is recommended)
-   **npm**, **yarn**, or **pnpm**: Pick one package manager for managing frontend dependencies

## ⚙️ Setup Steps

### 1. Clone the Repository

Clone this frontend repository from GitHub and navigate to the project folder:

```bash
git clone https://github.com/jstcode-hub/pemira-client.git
cd pemira-client
```

### 2. Install Dependencies

Install all the dependencies required by Nuxt.js. You can use one of these commands based on your preferred package manager:

```bash
npm install
```

or

```bash
yarn install
```

or

```bash
pnpm install
```

### 3. Create the `.env` Configuration File

Create a `.env` file by copying `.env.example`, which includes important variables for the app:

```bash
cp .env.example .env
```

Then, open the `.env` file and add or adjust the following values to match your setup:

```dotenv
# Build Environment
NUXT_PUBLIC_BUILD=development

# API Configuration
NUXT_PUBLIC_API_BASE=http://localhost:8000/api

# Google OAuth Configuration (CLIENT-SIDE - PUBLIC VALUES ONLY)
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NUXT_PUBLIC_GOOGLE_REDIRECT_URL=http://localhost:3000/authenticate

# Year Configuration
NUXT_PUBLIC_YEAR=2026

# Host Configuration (for development)
NUXT_PUBLIC_HOST=localhost
```

> **⚠️ IMPORTANT SECURITY NOTE**: 
> - **DO NOT** add `GOOGLE_CLIENT_SECRET` to this `.env` file!
> - The client secret must **ONLY** be stored in the backend (pemira-api).
> - Only the `GOOGLE_CLIENT_ID` is needed on the frontend - it's safe to be public.

### 4. Getting Google OAuth Credentials

To set up Google OAuth authentication, follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** and choose **OAuth Client ID**.
5. If prompted, configure the OAuth consent screen first.
6. Set **Application Type** to **Web Application**.
7. Under **Authorized JavaScript origins**, add:
    ```
    http://localhost:3000
    https://pemiraif.com
    ```
8. Under **Authorized redirect URIs**, add:
    ```
    http://localhost:3000/authenticate
    https://pemiraif.com/authenticate
    ```
9. Click **Create** and copy the generated **Client ID**.
10. Paste the **Client ID** into your `.env` file under `NUXT_PUBLIC_GOOGLE_CLIENT_ID`.
11. **Important**: Copy the **Client Secret** as well, but add it to the **backend** `.env` file (pemira-api), NOT the frontend!

### 5. Run the Development Server

Once everything is set up, start the Nuxt.js development server with one of the following commands:

```bash
npm run dev
```

or

```bash
yarn dev
```

or

```bash
pnpm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) by default.

---


## 🎯 Troubleshooting

-   **Dependency or Node.js version issues?** Make sure your Node.js and npm/yarn/pnpm are up to date.
-   **`.env` file issues?** Double-check that all variables are correctly filled out in your `.env` file.
-   **OAuth not working?** Ensure:
    - The redirect URI in Google Console matches exactly: `http://localhost:3000/authenticate`
    - The backend API is running and accessible
    - The `NUXT_PUBLIC_API_BASE` points to the correct backend URL
-   **CORS errors?** Make sure the backend is configured to accept requests from your frontend domain.

---

## 📁 Project Structure

```
pemira-client/
├── assets/          # CSS, images, and other static assets
├── components/      # Reusable Vue components
│   └── ui/         # UI components with 'Ui' prefix
├── composables/     # Composable functions for shared logic
├── pages/          # Application routes and pages
│   ├── login.vue   # Login page with OAuth
│   └── authenticate.vue  # OAuth callback handler
├── plugins/        # Nuxt plugins
├── public/         # Public static files
├── types/          # TypeScript type definitions
└── nuxt.config.ts  # Nuxt configuration
```

---

## 🤝 Contributing

If you're a collaborator, please follow these contribution guidelines to keep everything organized:

1. **Create a New Branch**  
   Each contributor should create a new branch for development using the format `[role]-[name]`. For example:

    ```bash
    git checkout -b frontend-dev-john
    ```

    or

    ```bash
    git checkout -b frontend-feature-ana
    ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Test your changes locally before pushing

3. **Push to Your Branch**  
   After making changes, push them to your branch:

    ```bash
    git add .
    git commit -m "Descriptive commit message"
    git push origin frontend-dev-john
    ```

4. **Create a Pull Request**  
   When your changes are ready, create a pull request from your branch to the main branch. All pull requests will be reviewed before merging.

> **Note**: Make sure to follow the branch naming format above, and ensure your pull request is ready for review so it can be merged into the main branch.

---

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run generate` - Generate static site
- `npm run postinstall` - Run after installation (auto-configured by Nuxt)

---

Thanks for following along, and happy coding! If you have any questions or run into any issues, don't hesitate to ask. Hope everything goes smoothly! 😄
