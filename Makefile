# Makefile para gerenciar o ambiente de desenvolvimento

DOCKER_COMPOSE = docker compose
DOCKER_ENV = .env.docker

ifeq ($(OS),Windows_NT)
help: ## Comandos disponíveis 
	@findstr /R /C:"^[a-zA-Z0-9_-]*:.*##" $(MAKEFILE_LIST) | powershell -Command "$$input | foreach { if ($$_ -match '^([a-zA-Z0-9_-]+):.*## (.*)') { Write-Host (' make {0,-20} => {1}' -f $$matches[1], $$matches[2]) -ForegroundColor Cyan } }"
else
help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
endif

up: ## Sobe todos os serviços com Docker Compose 
	@echo "Subindo a todos os serviços com Docker Compose..."
	$(DOCKER_COMPOSE) -f docker-compose.yml --env-file $(DOCKER_ENV) up -d --build

down: ## Para e remove os containers
	@echo "Parando e removendo containers..."
	$(DOCKER_COMPOSE) -f docker-compose.yml --env-file $(DOCKER_ENV) down

clean: ## Remove todos os containers, volumes e redes do Docker (cuidado!)
	@echo "Removendo volumes e redes..."
	$(DOCKER_COMPOSE) -f docker-compose.yml --env-file $(DOCKER_ENV) down --volumes --remove-orphans
	@docker volume prune -f
	@docker network prune -f

