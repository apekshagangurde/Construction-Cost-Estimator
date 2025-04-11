# Running the Construction Cost Estimator in VS Code

## Windows Setup Instructions

When running this project in VS Code on Windows, you need to make a few adjustments to make it work properly with environment variables.

### Step 1: Install cross-env

First, install cross-env to handle environment variables cross-platform:

```bash
npm install --save-dev cross-env
```

### Step 2: Update package.json scripts

Modify the scripts section in package.json:

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "cross-env NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

### Step 3: Set up Firebase Configuration

For Firebase integration to work properly, create a `.env` file in the root directory of your project with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

You'll need to replace these values with your actual Firebase project credentials.

### Step 4: Run the Application

After completing the above steps, you can run the application with:

```bash
npm run dev
```

## Troubleshooting

If you still encounter issues, try these alternatives:

### Alternative 1: Direct Windows Command

You can also modify your scripts to use the Windows command syntax:

```json
"scripts": {
  "dev": "set NODE_ENV=development && tsx server/index.ts",
  ...
}
```

### Alternative 2: Use Separate Scripts

```json
"scripts": {
  "dev:win": "set NODE_ENV=development && tsx server/index.ts",
  "dev:unix": "NODE_ENV=development tsx server/index.ts",
  ...
}
```

Then on Windows, use `npm run dev:win` to start the application.

## Project Structure Overview

- `/client` - React frontend code
- `/server` - Express backend code
- `/shared` - Shared types and schemas
- `/client/src/lib/firebase.ts` - Firebase configuration and service methods