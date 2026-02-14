# Lamp Controller — CLAUDE.md

## Project Overview

A static Vite + React + TypeScript single-page app for controlling Shelly smart home devices over their local HTTP API. Hosted on GitHub Pages. Only functional when the browser is on the home WiFi network.

## Architecture

### Request Flow

```
Browser (home WiFi)
  → https://proxy.stefangeneralao.com/{deviceId}/{shellyEndpoint}
  → Caddy reverse proxy on Raspberry Pi (192.168.0.189)
  → Shelly device HTTP API (e.g. http://192.168.0.201)
```

- All Shelly API calls are **client-side** (`fetch` from the browser). No server-side API routes.
- The proxy is only reachable on the home LAN. Outside the apartment all fetches silently fail.
- DNS for `proxy.stefangeneralao.com` resolves to `192.168.0.189` via dnsmasq on the Pi.
- TLS is terminated by Caddy using a Let's Encrypt cert (Cloudflare DNS challenge).

### Infrastructure

- **GitHub Pages** — hosts the static Vite build, globally over HTTPS
- **GitHub Actions** — builds and deploys to GitHub Pages on push to main
- **Raspberry Pi 4** (192.168.0.189) — runs Caddy + dnsmasq, always-on on home LAN
- **Cloudflare** — DNS for stefangeneralao.com, DNS-only (not proxied)
- **TP-Link AX1500** — home router, DHCP primary DNS set to 192.168.0.189

## Devices

Defined in `src/devices.ts`. All are Shelly Gen1 firmware.

| id     | name | type    | IP            |
| ------ | ---- | ------- | ------------- |
| lampa1 | TBD  | plug    | 192.168.0.201 |
| lampa2 | TBD  | shelly1 | 192.168.0.202 |

Update names and IPs in `src/devices.ts` as devices are added.

## Environment Variables

| Variable         | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| `VITE_PROXY_URL` | Base URL for the Caddy proxy, e.g. `https://proxy.stefangeneralao.com` |

- Local development: set in `.env.local` (not committed)
- Production: set as a secret in GitHub Actions (injected at build time)

## Shelly Gen1 API Reference

All requests are plain HTTP GET. The proxy strips the `/{deviceId}` prefix before forwarding.

### Relay Control

```
GET /relay/0?turn=on
GET /relay/0?turn=off
GET /relay/0?turn=toggle
GET /relay/0                          — read current state
```

Response includes `ison` (bool), `has_timer` (bool).

### Device Status

```
GET /status                           — full status: relay, wifi, uptime, power (plug)
```

### Scheduling (stored on-device, runs without the app)

```
GET /settings/relay/0                 — read current schedule rules
GET /settings/relay/0?schedule=true&schedule_rules=HHMM-WEEKDAYS-on/off
```

Schedule rule format: `HHMM-WEEKDAYS-action`

- `HHMM` — 24h time, e.g. `2300`
- `WEEKDAYS` — string of digits 0–6, where 0 = Sunday, e.g. `1234567` for every day, `12345` for weekdays
- `action` — `on` or `off`
- Multiple rules comma-separated, e.g. `2300-1234567-off,0700-12345-on`

### Power Monitoring (Shelly Plug only)

```
GET /meter/0                          — power (W), total energy (Wh), per-minute counters
```

## Features to Implement

- Toggle relay on/off per device
- Display current relay state (poll `/relay/0`)
- Weekly schedule editor (read/write `/settings/relay/0` schedule_rules)
- Power monitoring display for Plug devices (poll `/meter/0`)

## Development

```bash
npm install
npm run dev
```

## Deployment

Push to `main` → GitHub Actions builds → deploys to GitHub Pages automatically.

The GitHub Actions workflow should:

1. Run `npm install`
2. Run `npm run build`
3. Deploy `dist/` to GitHub Pages using the official `actions/deploy-pages` Action
4. Inject `VITE_PROXY_URL` from GitHub Actions secrets at build time

## Design Principles

- **Mobile first** — design for small screens first, scale up for larger ones
- Use a single-column layout on mobile, touch-friendly tap targets (min 44x44px)
- Tailwind breakpoints: base styles = mobile, `md:` = tablet and up
- Keep the UI minimal — this is a utility app used quickly, often in a dark room
