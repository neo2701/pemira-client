# 🌐 Pemira Frontend Setup Guide (Nuxt.js)

Hey! Welcome to the setup guide for the Pemira API frontend, built with Nuxt.js. Follow these steps to get everything up and running on your local server.

## 📝 Prerequisites

Before you start, make sure your device has the following:

-   **Node.js**: A recent, stable version (at least version 14.x is recommended)
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
NUXT_PUBLIC_BUILD=development
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
NUXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-client-secret
NUXT_PUBLIC_GOOGLE_REDIRECT_URL=http://localhost:3000/authenticate
```

> **Note**: Replace `your-client-id` and `your-client-secret` with the credentials from Google Console.

### 4. Getting `client_id` and `client_secret` from Google Console

To get `client_id` and `client_secret` from Google Console, follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Navigate to **APIs & Services**.
3. Select **Credentials**.
4. Click **Create Credentials** and choose **OAuth Client ID**.
5. Set **Application Type** to **Web Application**.
6. Under **Authorized redirect URIs**, add:
    ```
    http://localhost:3000/authenticate
    ```
7. Once complete, copy the generated **Client ID** and **Client Secret** to your `.env` file under `NUXT_PUBLIC_GOOGLE_CLIENT_ID` and `NUXT_PUBLIC_GOOGLE_CLIENT_SECRET`.

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

---

## 🤝 Contributing

If you’re a collaborator, please follow these contribution guidelines to keep everything organized:

1. **Create a New Branch**  
   Each contributor should create a new branch for development using the format `[role]-[name]`. For example:

    ```bash
    git checkout -b frontend-dev-john
    ```

    or

    ```bash
    git checkout -b frontend-feature-ana
    ```

2. **Push to Your Branch**  
   After making changes, push them to your branch:

    ```bash
    git push origin frontend-dev-john
    ```

3. **Create a Pull Request**  
   When your changes are ready, create a pull request from your branch to the main branch. All pull requests will be reviewed before merging.

> **Note**: Make sure to follow the branch naming format above, and ensure your pull request is ready for review so it can be merged into the main branch.

---

Thanks for following along, and happy coding! If you have any questions or run into any issues, don’t hesitate to ask. Hope everything goes smoothly! 😄
