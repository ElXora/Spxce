import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { createBareServer } from "@tomphttp/bare-server-node";
import httpProxy from "http-proxy";
import chalk from "chalk";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import express from "express";
import { createServer } from "node:http";
import { join } from "path";
import packageJson from "./package.json" with { type: "json" };
import compression from "compression";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { execSync } from "node:child_process";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";

dotenv.config();

Object.assign(wisp.options, {
  allow_udp_streams: false,
  dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const cdnProxy = httpProxy.createProxyServer();
const bare = createBareServer("/bare/");
const __dirname = join(fileURLToPath(import.meta.url), "..");
const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const publicPath = "public";

app.set("views", join(__dirname, publicPath, "html"));
app.use(compression());
app.use(express.static(publicPath));
app.use("/game", express.static(join(__dirname, publicPath, "game")));
const GAME_MIRRORS = [
  "https://cdn.jsdelivr.net/gh/freebuisness/html@main/",
  "https://raw.githubusercontent.com/freebuisness/html/main/",
  "https://fastly.jsdelivr.net/gh/freebuisness/html@main/",
];
// game not in public/game -> try mirrors (served as text/html), else show a visible message
app.get("/game/:file", async (req, res) => {
  for (const base of GAME_MIRRORS) {
    try {
      const r = await fetch(base + encodeURIComponent(req.params.file));
      if (r.ok) {
        res.set("Content-Type", "text/html; charset=utf-8");
        return res.send(await r.text());
      }
    } catch (e) {}
  }
  res
    .status(404)
    .send('<body style="margin:0;background:#111;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:20px">This game file is missing on the server.<br>Put it in /root/Spxce/public/game/</body>');
});
app.use("/uv/", express.static(uvPath));
app.use("/scram/", express.static(scramjetPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/bareasmodule/", express.static(bareModulePath));
app.use("/sj/sw.js", (req, res, next) => {
  res.set("Service-Worker-Allowed", "/");
  next();
});
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "index.html"));
});
app.use("/cdn", (req, res) => {
  cdnProxy.web(
    req,
    res,
    {
      target: "https://gms.parcoil.com/",
      changeOrigin: true,
    },
    (err) => {
      if (err) {
        console.error("CDN proxy error:", err);
        res.status(500).json({ error: "CDN Proxy Error" });
      }
    }
  );
});
app.use("/cdnalt", (req, res) => {
  cdnProxy.web(
    req,
    res,
    {
      target: "https://gbackup.parcoil.com/",
      changeOrigin: true,
    },
    (err) => {
      if (err) {
        console.error("CDN-2 proxy error:", err);
        res.status(500).json({ error: "CDN Proxy Error" });
      }
    }
  );
});
app.get("/api/autocomplete", async (req, res) => {
  const q = req.query.q || "";
  const duckUrl = `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(duckUrl);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});
app.get("/api/version", (req, res) => {
  res.json({ version: packageJson.version });
});
app.get("/api/commit", (req, res) => {
  try {
    const commit = execSync("git rev-parse --short HEAD").toString().trim();
    res.json({ commit });
  } catch (err) {
    res.status(500).json({ error: "Could not get commit" });
  }
});

// this is for the users who have a bookmark like https://spxce.org/play?game=2048
app.get("/play", (req, res) => {
  res.redirect("/science");
});

app.get("/science", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "games.html"));
});
app.get("/forum/*", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "forum.html"));
});
app.get("/math", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "apps.html"));
});
app.get("/settings", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "settings.html"));
});
app.get("/go", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "go.html"));
});
app.get("/new", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "new.html"));
});
app.get("/more", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "more.html"));
});
app.get("/package.json", (req, res) => {
  res.json(packageJson);
});
app.get("/about", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "about.html"));
});
app.get("/terms", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "terms.html"));
});
app.get("/privacy", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "privacy.html"));
});
app.get("/contact", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "contact.html"));
});
app.get("/blog", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "blog.html"));
});
app.get("/blog/:slug", (req, res) => {
  const slug = req.params.slug.replace(/[^a-z0-9-]/g, "");
  res.sendFile(join(__dirname, publicPath, "html", "blog", slug + ".html"), (err) => {
    if (err) res.status(404).sendFile(join(__dirname, publicPath, "html", "404.html"));
  });
});
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, publicPath, "html", "404.html"));
});
const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();
  console.clear();
  console.log(
    chalk.magenta(
      `[ 🚀 ] Spxce V7 is running at http://localhost:${address.port}`
    )
  );
  console.log();
  console.log(chalk.green(`[ 🌙 ] SPXCE`));
  console.log();
  console.log(
    chalk.blue(
      `[ ⭐ ] SPXCE is running`
    )
  );
  console.log();
  console.log(
    chalk.cyan(
    )
  );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});
