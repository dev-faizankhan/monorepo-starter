# monorepo-starter

> A minimal **Node.js + Express** backend wired up as an **npm workspaces monorepo**, with a placeholder folder for any frontend you want to plug in. Built as a learning-friendly starter — clear structure, no magic, well-commented config.

[![Node.js](https://img.shields.io/badge/node-%3E%3D20-43853d?logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D8-cb3837?logo=npm&logoColor=white)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [Prerequisites](#2-prerequisites)
3. [Knowledge checklist](#3-knowledge-checklist)
4. [First-time setup](#4-first-time-setup)
5. [Everyday commands](#5-everyday-commands)
6. [Where to add your own code](#6-where-to-add-your-own-code)
7. [Environment variables & secrets](#7-environment-variables--secrets)
8. [Gotchas & hard-won tips](#8-gotchas--hard-won-tips)
9. [Suggested learning path](#9-suggested-learning-path)
10. [Asking for help](#10-asking-for-help)
11. [License](#11-license)

---

## 1. What this project is

This is a **monorepo** — one Git repository that holds multiple apps side by side.

```
monorepo-starter/
├── apps/
│   ├── api/          # Node.js + Express backend
│   └── webapp/       # empty folder — scaffold your own frontend here
└── package.json      # the root that wires the apps together
```

The wiring is done with [**npm workspaces**](https://docs.npmjs.com/cli/v9/using-npm/workspaces) — a built-in npm feature that lets one `npm install` at the root install dependencies for every app at once.

---

## 2. Prerequisites

Install these before you start:

| | Tool | Version | Where |
|---|---|---|---|
| ☐ | Node.js | 20 or newer (LTS is fine) | <https://nodejs.org/> |
| ☐ | npm | 8 or newer (ships with Node) | — |
| ☐ | Git | any recent | <https://git-scm.com/> |
| ☐ | A code editor | VS Code recommended | <https://code.visualstudio.com/> |
| ☐ | An API client *(optional)* | Postman / Insomnia / Thunder Client | <https://www.postman.com/> |

Verify your versions in a terminal:

```bash
node --version    # should print v20.x.x or higher
npm  --version    # should print 8.x or higher
git  --version
```

---

## 3. Knowledge checklist

### Required (cannot skip)

- **Basic JavaScript** — variables, functions, objects, arrays, `async`/`await`
- **Using a terminal** — `cd`, `ls` / `dir`, running commands
- **What Node.js is** — JavaScript that runs outside the browser
- **What npm is** — the package manager for Node.js (installs libraries)

### Very helpful (basics in 1–2 hours each)

- [**Express.js**](https://expressjs.com/en/starter/hello-world.html) — the web framework used by `apps/api`
- **HTTP basics** — `GET` / `POST` / `PUT` / `DELETE`, status codes (200, 404, 500), request body vs query params vs headers
- **JSON** — the data format APIs speak
- **Environment variables (`.env`)** — how secrets/config live *outside* your code
- **Git basics** — clone, add, commit, push, pull, branch

### Nice to know (pick up as you go)

- [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- **CORS** — why your browser blocks requests across domains
- **Middleware pattern** — Express's "stack of functions" model
- **REST API design** — naming routes, status codes, idempotency

---

## 4. First-time setup

Run these in order:

```bash
# 1) Get the code
git clone https://github.com/dev-faizankhan/monorepo-starter.git
cd monorepo-starter

# 2) Install dependencies for ALL apps at once
npm install
```

Create the API's local `.env` file (never commit this!):

**Windows PowerShell:**
```powershell
copy apps\api\example.env apps\api\.env
```

**Mac / Linux / Git Bash:**
```bash
cp apps/api/example.env apps/api/.env
```

Start the API in development mode (auto-restarts on file changes):

```bash
npm run dev:api
```

You should see:

```
API listening on http://localhost:3000
```

Open <http://localhost:3000/health> in your browser. You should see something like:

```json
{ "status": "ok", "uptime": 1.23, "timestamp": "2026-05-13T..." }
```

If you see that — congratulations, the backend is running.

---

## 5. Everyday commands

Run all of these from the **project root**.

| Command | What it does |
|---|---|
| `npm run dev:api` | Start the API with auto-reload (nodemon) |
| `npm start` | Start the API in production mode (no auto-reload) |
| `npm install` | Install / refresh all dependencies |
| `npm test` | Run tests across all apps |
| `npm run lint` | Lint code across all apps |
| `npm run format` | Auto-format code with Prettier |

Workspace-specific dependency management:

```bash
# Add a dependency ONLY to the API app
npm install <package> --workspace=apps/api

# Add a dev-only dependency to the API app
npm install <package> --workspace=apps/api --save-dev

# Remove a dependency from the API app
npm uninstall <package> --workspace=apps/api
```

---

## 6. Where to add your own code

### Adding a new API endpoint (example: `/api/users`)

**1.** Create `apps/api/routes/users.js`:

```js
const express = require("express");
const router  = express.Router();

router.get("/", (req, res) => {
  res.json([{ id: 1, name: "Alice" }]);
});

module.exports = router;
```

**2.** Open `apps/api/app.js` and mount it:

```js
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
```

**3.** Save. Nodemon will auto-restart. Test it at <http://localhost:3000/api/users>.

### Adding new middleware

Middleware runs on every request (auth checks, logging, etc.).

- Put it in `apps/api/middleware/<name>.js`
- Wire it up in `apps/api/app.js` with `app.use(...)`

### Scaffolding the frontend inside `apps/webapp`

Vite + React is a great default:

```bash
cd apps/webapp
npm create vite@latest . -- --template react
cd ../..
npm install
```

The root workspace will pick it up automatically.

---

## 7. Environment variables & secrets

| File | Purpose | In Git? |
|---|---|---|
| `apps/api/example.env` | Template — committed so others know which vars exist | ✅ |
| `apps/api/.env` | Your **real local** values | ❌ (gitignored) |

> [!WARNING]
> **Never commit a real `.env` file.** Never paste real API keys, DB passwords, or private keys into `example.env`.

The root `.gitignore` already excludes:

```
.env, .env.local, .env.development, .env.test, .env.production
*.pem, *.key             # SSH and private keys
*.log, logs/             # log files
```

Variables already defined in `apps/api/example.env`:

| Variable | Meaning |
|---|---|
| `PORT` | which port the API listens on (default 3000) |
| `NODE_ENV` | `development` or `production` — controls error verbosity |
| `CORS_ORIGIN` | which website is allowed to call this API from the browser |
| `LOG_LEVEL` | morgan log format (`dev`, `combined`, `tiny`) |

Use a variable in code:

```js
process.env.PORT
process.env.MY_NEW_VAR
```

To add a new variable:

1. Add it to `apps/api/example.env` **without** the real secret value
2. Add it to `apps/api/.env` **with** the real value
3. Tell your teammate it exists (documentation note in this README, chat message, etc.)

---

## 8. Gotchas & hard-won tips

- **Always run npm commands from the project root**, not from inside `apps/api`. Workspaces resolve from the root — running `npm install` inside `apps/api` creates a second `node_modules` and confuses things.

- **Only one `node_modules` should exist** (at the project root). If you see one inside `apps/api`, delete it and re-run `npm install` at the root.

- **If `npm install` misbehaves, the nuclear option:**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

- **Port 3000 already in use?** Change `PORT` in `apps/api/.env` to `3001`, or kill the other process:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <pid> /F

  # Mac / Linux
  lsof -i :3000
  kill -9 <pid>
  ```

- **Nodemon not restarting?** It only watches `.js` / `.json` files by default. For other file types, add a `nodemon.json` config.

- **CORS errors in the browser (`"blocked by CORS policy"`)?** Set `CORS_ORIGIN` in `apps/api/.env` to your frontend's URL, e.g. `CORS_ORIGIN=http://localhost:5173`. **Restart the API after changing `.env`** — `dotenv` only reads the file at startup.

- **Postman / curl works but the browser fails?** That's almost always CORS. Browsers enforce it; Postman doesn't.

- **`res.json()` vs `res.send()`** — use `res.json()` for objects/arrays. It sets the `Content-Type` header to `application/json` automatically.

- **Call `res.something()` exactly once per request.** Sending two responses crashes with `"Cannot set headers after they are sent to the client."`

- **Async route handlers** — if you use `async`/`await` inside a route, wrap the handler in `utils/asyncHandler.js` (already provided) so thrown errors reach the error middleware instead of crashing the server silently.

- **Error handler must be LAST.** In `app.js`, `app.use(errorHandler)` must come after all routes. Express middleware runs in the order it's registered.

- **The `"// Development"` lines in `package.json` are intentional comments.** npm allows script names starting with `//` — they're ignored. Handy for grouping.

- **Don't commit:** `.env`, `*.pem`, `*.key`, `node_modules/`, `logs/`, `*.zip`, `*.tar.gz`. The `.gitignore` already covers these — just don't `git add -f` them.

- **The `apps/webapp` folder is empty on purpose.** Pick the framework that fits your project, scaffold it inside `apps/webapp/`, and the workspace setup will absorb it.

---

## 9. Suggested learning path

If you're starting from zero, ~1 week part-time:

| Day | Topic | Resource |
|---|---|---|
| 1 | JavaScript basics + the terminal | [javascript.info](https://javascript.info/) (chapters 1–6) |
| 2 | Node.js + npm | [Node.js intro](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) |
| 3 | Express hello-world (build a tiny app *outside* this project) | [Express docs](https://expressjs.com/en/starter/hello-world.html) |
| 4 | HTTP & REST concepts + Postman | [restfulapi.net](https://restfulapi.net/) |
| 5 | Git basics (clone / commit / push / branch / merge) | [Learn Git Branching](https://learngitbranching.js.org/) (free, interactive) |
| 6–7 | Come back here. Read `apps/api/app.js` line by line, then add a new route on your own. | — |

---

## 10. Asking for help

When something doesn't work, gather this first — it saves everyone time:

- [ ] What command did you run?
- [ ] What was the **exact** error message? (copy/paste, not paraphrase)
- [ ] Did it ever work? If yes, what changed?
- [ ] Output of `node --version` and `npm --version`
- [ ] Which folder were you in?

Reference docs that will answer most questions:

- Express: <https://expressjs.com/>
- Node.js: <https://nodejs.org/en/docs/>
- npm: <https://docs.npmjs.com/>

---

## 11. License

[MIT](LICENSE) — free for personal, commercial, and educational use. Attribution appreciated but not required.
