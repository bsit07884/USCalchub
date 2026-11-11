# USCalcHub Project & Antigravity Setup Instructions
**Target Environment:** Windows (Fresh Reinstallation)  
**Permanent Project Path:** `D:\Website Development\uscalchub`  
**Antigravity Backup Path:** `D:\Website Development\Antigravity_Backup`

---

## 🤖 INSTRUCTIONS FOR ANTIGRAVITY AGENT (AUTONOMOUS BOOTSTRAP)

If you are an Antigravity AI Agent reading this file after the user opened `D:\Website Development\uscalchub` as a workspace, execute the following bootstrap sequence:

1. **Verify Environment Tools:**
   * Run `node -v` (Node.js LTS v20+ or v22+ required).
   * Run `npm -v`.
   * Run `python --version` (Python 3.10+ required).
   * Run `git --version`.
   * If any of these are missing, halt and clearly instruct the user which runtime installer to download.

2. **Verify & Restore Antigravity Chat History / Brain / Config (If not already restored):**
   * Check if `C:\Users\%USERNAME%\.gemini\antigravity\conversations\934bafbd-6fa0-45e8-8990-c1ad9e4379be.pb` exists.
   * If not found, copy files from `D:\Website Development\Antigravity_Backup` to `C:\Users\%USERNAME%\.gemini\`:
     * `D:\Website Development\Antigravity_Backup\conversations` -> `C:\Users\%USERNAME%\.gemini\antigravity\conversations`
     * `D:\Website Development\Antigravity_Backup\brain` -> `C:\Users\%USERNAME%\.gemini\antigravity\brain`
     * `D:\Website Development\Antigravity_Backup\config` -> `C:\Users\%USERNAME%\.gemini\config`
     * Root files (`conversation_summaries.db*`, `agyhub_summaries_proto.pb`, `chapter_titles`) -> `C:\Users\%USERNAME%\.gemini\antigravity\`

3. **Install Dependencies:**
   * In workspace root (`D:\Website Development\uscalchub`):
     * Check if `node_modules` exists. If not, execute `npm install`.
   * In `pseo-builder` directory (`D:\Website Development\uscalchub\pseo-builder`):
     * Check if `node_modules` exists. If not, execute `cd pseo-builder && npm install`.

4. **Verify Git Remote & Branches:**
   * Run `git status` (Ensure working directory is clean).
   * Run `git remote -v` (Ensure origin points to `https://github.com/bsit07884/USCalchub.git`).
   * Run `git branch -a` (Ensure `main` is active).

5. **Report Status to User:**
   * Confirm that the project is running directly from `D:\Website Development\uscalchub`, all packages are installed, git is in sync with GitHub, and the environment is ready for coding!

---

## 👤 STEP-BY-STEP MANUAL GUIDELINE FOR THE USER

If you prefer to set up manually or Antigravity has just been installed, follow these simple steps:

### Step 1: Install 3 Basic Runtimes
On your fresh Windows installation, download and install:
1. **Git for Windows:** [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. **Node.js (LTS Version):** [https://nodejs.org/](https://nodejs.org/) (Choose LTS, e.g., v22.x)
3. **Python 3:** [https://www.python.org/downloads/](https://www.python.org/downloads/) (Make sure to check *"Add Python to PATH"* during installation).

### Step 2: Restore Antigravity Chats & Memories (1-Click or Manual Copy)
Before or right after opening Antigravity:
1. Go to `D:\Website Development\Antigravity_Backup`.
2. Copy the folders:
   * Copy `conversations`, `brain`, `chapter_titles`, and the `.db` files into:  
     `C:\Users\<YourUsername>\.gemini\antigravity\`
   * Copy the `config` folder into:  
     `C:\Users\<YourUsername>\.gemini\config\`
3. That's it! When you launch Antigravity, all your past chats, memories, and previous conversation records will appear exactly as they were.

### Step 3: Run the 1-Click Environment Setup Script
Inside `D:\Website Development\uscalchub`, double-click:
👉 `setup_environment.bat`  
This script automatically checks Node, Python, Git, restores your Antigravity files, and installs all npm dependencies.

---

## 📁 PROJECT ARCHITECTURE & BUILD COMMANDS

* **Repository:** `https://github.com/bsit07884/USCalchub.git`
* **Branch:** `main`
* **Deployment Mechanism:** Automatic GitHub Actions FTP Deploy to cPanel on every push to `main` (`.github/workflows/deploy.yml`).
* **Root Build Command (Tailwind CSS + Sitemap):**
  ```bash
  npm run build
  ```
* **Tailwind Watch Command (Development):**
  ```bash
  npm run watch
  ```
* **pSEO Builder Command:**
  ```bash
  cd pseo-builder
  npm install
  npm run build
  ```

---

## 🛡️ WHY WORKING DIRECTLY FROM D: DRIVE IS RECOMMENDED
* **Operating System Isolation:** Windows OS files, updates, and temp caches stay on C: without being bloated by multi-gigabyte `node_modules` or build caches.
* **Disaster Immunity:** If Windows ever crashes, gets corrupted, or needs another reinstallation in the future, your entire project on `D:\Website Development\uscalchub` remains 100% untouched and safe.
* **Zero Performance Loss:** Modern NVMe / SSD drives perform equally fast across partitions.
