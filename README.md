# FurniVision

This is a NextJS web application for interactive 2D room layouts and 3D isometric visualization.

## Getting Started (Fresh Install)

If you are a lecturer or a group member starting this project fresh (after extracting the ZIP without `node_modules` or pulling from GitHub), follow these steps to initialize and run the application:

### Prerequisites
- Ensure you have **Node.js** installed on your system (v18 or higher recommended).
- You will need an active internet connection to download the required packages.

### Step 1: Install Dependencies
Open your terminal (Command Prompt, PowerShell, or Mac Terminal), navigate to the root folder of this project (`FurniVision`), and run the following command to download all necessary libraries:
```bash
npm install
```
*(This may take a minute as it rebuilds the `node_modules` folder.)*

### Step 2: Start the Development Server
Once the installation is complete, start the local Next.js development server by running:
```bash
npm.cmd run dev
```

### Step 3: Open the Application
Open your web browser and navigate to:
```text
http://localhost:9002
```
You should now see the FurniVision application running locally!

---

### Hot Reloading & Restarting

**Hot Reload (Fast Refresh):**
This application uses Next.js with Turbopack, which includes Fast Refresh. Whenever you save a change to a React component or CSS file, the browser will automatically update only the changed parts of the application without losing your current state (like text in an input field).
- **How to trigger:** Simply edit any `.tsx` or `.css` file and save it (`Ctrl+S` / `Cmd+S`).

**Hot Restart / Full Restart:**
If you make changes to core configuration files (like `next.config.ts`, `tailwind.config.ts`, or `.env`), or if the application gets stuck into a weird state, you may need a full restart rather than a hot reload.
- **How to trigger:** 
  1. Go to the terminal where the development server is running.
  2. Stop the server by pressing `Ctrl + C` (you may need to press `Y` to confirm).
  3. Start the server again by running `npm.cmd run dev`.

---

### Testing
This project includes a comprehensive Jest testing suite to validate utility functions and computer graphics algorithms. To execute the tests, run:
```bash
npm run test
```

### Building for Production
To build the application for deployment or production testing, run:
```bash
npm run build
```