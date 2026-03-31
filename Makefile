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
COMPOSE    := docker compose -f .docker/compose.yml

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
.PHONY: lint lint-fix typecheck check

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	npx eslint --fix .

typecheck: ## Run TypeScript type checking
	npx tsc --noEmit

check: lint typecheck ## Run lint + typecheck

# ── Build ──────────────────────────────────────────────────
.PHONY: build start

build: ## Build for production (standalone)
	npm run build

start: build ## Build and start production server
	npm run start

# ── Docker ─────────────────────────────────────────────────
.PHONY: up up-build down logs shell

up: ## Start dev environment in Docker
	$(COMPOSE) up

up-build: ## Rebuild and start dev containers
	$(COMPOSE) up --build

down: ## Stop dev environment
	$(COMPOSE) down

logs: ## Tail container logs
	$(COMPOSE) logs -f

shell: ## Open shell in running container
	$(COMPOSE) exec app sh

# ── Utilities ──────────────────────────────────────────────
.PHONY: nuke

nuke: ## Full clean — remove node_modules, .next, out
	rm -rf node_modules .next out
