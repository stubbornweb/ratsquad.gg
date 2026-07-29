# rats-site — Next.js 16 App Router
# Usage: make help

SHELL := /bin/bash
.DEFAULT_GOAL := help
.DELETE_ON_ERROR:
.SHELLFLAGS := -euo pipefail -c
MAKEFLAGS += --warn-undefined-variables --no-print-directory

# ── Variables ──────────────────────────────────────────────
APP_NAME   := rats-site
PORT       := 3000
# Docker Compose (Bun dev environment)
# UID/GID are passed through so the container writes host-owned files.
export DOCKER_UID := $(shell id -u)
export DOCKER_GID := $(shell id -g)
COMPOSE    := docker compose -f .docker/compose.bun.yml

# ── Help ───────────────────────────────────────────────────
.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── Development ────────────────────────────────────────────
.PHONY: dev install clean

dev: ## Start Next.js dev server
	npm run dev

install: ## Install dependencies
	npm install

clean: ## Remove build artifacts
	rm -rf .next out node_modules/.cache

# ── Quality ────────────────────────────────────────────────
.PHONY: lint lint-fix typecheck test test-watch check

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	npx eslint --fix .

typecheck: ## Run TypeScript type checking
	npx tsc --noEmit

test: ## Run the test suite
	npm run test

test-watch: ## Run the test suite in watch mode
	npm run test:watch

check: lint typecheck test ## Run lint + typecheck + tests

# ── Build ──────────────────────────────────────────────────
.PHONY: build start

build: ## Build for production (standalone)
	npm run build

start: build ## Build and start production server
	npm run start

# ── Docker ─────────────────────────────────────────────────
.PHONY: up up-build down logs shell bun-perms

# Docker creates named volumes owned by root; the container runs as the host
# user and could not otherwise write into them. Idempotent — safe to re-run.
BUN_VOLUMES := rats-site_bun_node_modules rats-site_bun_next

bun-perms: ## Make the bun container's volumes writable by the host user
	@$(COMPOSE) create >/dev/null 2>&1
	@for v in $(BUN_VOLUMES); do \
		docker run --rm -u 0 -v $$v:/mnt oven/bun \
			chown $(DOCKER_UID):$(DOCKER_GID) /mnt; \
	done

up: bun-perms ## Start dev environment in Docker
	$(COMPOSE) up

up-build: bun-perms ## Rebuild and start dev containers
	$(COMPOSE) up --build

down: ## Stop dev environment
	$(COMPOSE) down

logs: ## Tail container logs
	$(COMPOSE) logs -f

shell: ## Open shell in running container
	$(COMPOSE) exec app sh

# ── Utilities ──────────────────────────────────────────────
.PHONY: nuke discord-roles discord-channels check-provisioning

discord-roles: ## List Discord role IDs
	npx --no-install tsx --env-file=.env.local scripts/list-discord-roles.ts

discord-channels: ## List Discord channel IDs
	npx --no-install tsx --env-file=.env.local scripts/list-discord-channels.ts

check-provisioning: ## Verify credentials, channel IDs and bot permissions (issue #14)
	npx --no-install tsx --env-file=.env.local scripts/check-provisioning.ts

nuke: ## Full clean — remove node_modules, .next, out
	rm -rf node_modules .next out
