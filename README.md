# 05-wams-fe

> Multi repository front-end.

# Technology Stack

| Component  | Technology |
|------------|------------|
| node       | 20.18.0    |
| react      | 17.0.38    |
| npm        | 6.1.1      |
| pnpm       | 8.15.7     |
| eslint     | 8.48.0     |
| turbo      | latest     |
| typescript | 5.6.3      |

# Getting Started

## Prerequisites

- Install Git last version from https://git-scm.com/downloads/win
- Install Intellij IDEA last version (Ultimate or Community) from https://www.jetbrains.com/idea/download/other.html
- Install Node.js 20.18.0 from https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip

### WAMS front

- Clone the project from https://github.com/your-org/05-wams-fe
- Open the project with Intellij IDEA (open as maven project)
- Run: npm install -g pnpm@9.12.3
- Run: npm install turbo --global
- Run: pnpm install
- Run: pnpm run build:docker-prod

# Node.js Setup via Command Line

## 1. Install Node.js

### Windows (PowerShell)

Using winget:

```
winget install OpenJS.NodeJS
```

Using Chocolatey:

```
choco install nodejs -y
```

### Linux (Ubuntu/Debian)

```
sudo apt update
sudo apt install -y nodejs npm
```

### macOS (Homebrew)

```
brew install node
```

---

## 2. Verify Installation

```
node -v
npm -v
```

---

## 3. Create a New Project

```
mkdir my-app
cd my-app
npm init -y
```

---

## 4. Create and Run a Test File

Create file:

```
echo console.log("Hello Node") > app.js
```

Run:

```
node app.js
```

---

## 5. Install Dependencies (Optional)

Example:

```
npm install express
```

---

## 6. Add Start Script

Edit package.json:

```
{
  "scripts": {
    "start": "node app.js"
  }
}
```

Run:

```
npm start
```

---

## 7. Using with IntelliJ

* Open project in IntelliJ
* Open terminal
* Run:

```
node app.js
```

---

## 8. Optional: Use NVM (Node Version Manager)

Install NVM:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Install Node LTS:

```
nvm install --lts
nvm use --lts
```

---

## Done ✅

Your Node.js environment is ready.

