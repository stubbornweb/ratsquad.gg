# Patches Index

> Updated by `patch-writer` after every bugfix.
> Read by `master-orchestrator` for selective patch loading.
> Processed by `skill-evolver` during `/workflow:evolve`.

---

## How to Read This File

Each patch is listed under its category with tags for quick matching.
Master-orchestrator reads this file first, then loads only the patches
whose category matches keywords in the current issue.

**Category keyword mapping:**
- `docker` — docker, container, compose, volume, network
- `testing` — test, coverage, pest, phpunit, vitest, jest, flaky
- `security` — security, vulnerability, injection, xss, auth, token
- `php` — php, laravel, eloquent, artisan, service, repository
- `frontend` — vue, react, nuxt, next, component, composable, hook
- `integration` — stripe, webhook, api, http, external, third-party
- `configuration` — env, config, deployment, docker-compose, .env
- `workflow` — pipeline, agent, command, orchestrator, rule

---

## docker

<!-- Example:
- [2026-03-14-container-startup-race.md] — Container startup race condition — tags: docker, startup, compose
  ✅ Absorbed: 2026-03-20 → added startup health check to docker-expert checklist
-->

*(no patches yet)*

---

## testing

*(no patches yet)*

---

## security

*(no patches yet)*

---

## php

*(no patches yet)*

---

## frontend

*(no patches yet)*

---

## integration

*(no patches yet)*

---

## configuration

*(no patches yet)*

---

## workflow

*(no patches yet)*
