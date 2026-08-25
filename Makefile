NAME				= ft_transcendence
COMPOSE_FILE		= ./docker-compose.yml
PROJECT_NAME		= ft_transcendence
ENV_FILE			?= $(HOME)/.ft_transcendence.env
DOCKER_COMPOSE		= docker compose --env-file $(ENV_FILE) -p $(PROJECT_NAME) --file $(COMPOSE_FILE)
export DATA_PATH	?= /var/lib/ft_transcendence

# Colors for terminal output
COLOR_RESET			= \033[0m
COLOR_INFO			= \033[1;36m
COLOR_SUCCESS		= \033[1;32m
COLOR_WARN			= \033[1;33m
COLOR_DANGER		= \033[1;31m

.PHONY: all init build up start down stop restart logs ps status clean fclean clear re help

all: build

# Initialize production data directories in /var/lib/transcendence (or custom DATA_PATH)
init:
	@echo "$(COLOR_INFO)Checking production data directories in $(DATA_PATH)...$(COLOR_RESET)"
	@if [ ! -d "$(DATA_PATH)/postgres" ] || [ ! -d "$(DATA_PATH)/pgadmin" ] || [ ! -d "$(DATA_PATH)/uploads" ]; then \
		echo "$(COLOR_WARN)Creating $(DATA_PATH) directories (requires sudo)...$(COLOR_RESET)"; \
		sudo mkdir -p $(DATA_PATH)/postgres $(DATA_PATH)/pgadmin $(DATA_PATH)/uploads; \
		sudo chmod -R 775 $(DATA_PATH); \
	fi

# Build and start all services in detached mode
build: init
	@echo "$(COLOR_INFO)Building and starting $(NAME) containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) up -d --build
	@echo "$(COLOR_SUCCESS)$(NAME) is up and running!$(COLOR_RESET)"

# Start services without rebuilding
up start: init
	@echo "$(COLOR_INFO)Starting $(NAME) containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) up -d
	@echo "$(COLOR_SUCCESS)Containers started.$(COLOR_RESET)"

# Stop services
down stop:
	@echo "$(COLOR_INFO)Stopping $(NAME) containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) down
	@echo "$(COLOR_SUCCESS)Containers stopped.$(COLOR_RESET)"

# Restart services
restart:
	@echo "$(COLOR_INFO)Restarting $(NAME) containers...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) restart
	@echo "$(COLOR_SUCCESS)Containers restarted.$(COLOR_RESET)"

# Follow logs in real time
logs:
	@$(DOCKER_COMPOSE) logs -f

# Check containers status
ps status:
	@$(DOCKER_COMPOSE) ps

# Clean containers and networks (preserves volumes and images)
clean:
	@echo "$(COLOR_WARN)Cleaning containers and networks...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) down --remove-orphans
	@echo "$(COLOR_SUCCESS)Clean complete.$(COLOR_RESET)"

# Full clean: removes containers, networks, volumes, images and production data
fclean clear:
	@echo "$(COLOR_DANGER)Stopping containers and removing volumes, networks, and images...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans
	@if [ -d "$(DATA_PATH)" ]; then \
		echo "$(COLOR_DANGER)Removing production data directories in $(DATA_PATH) (requires sudo)...$(COLOR_RESET)"; \
		sudo rm -rfv $(DATA_PATH); \
	fi
	@echo "$(COLOR_SUCCESS)Full cleanup complete.$(COLOR_RESET)"

# Rebuild and restart everything from scratch
re: fclean all

# Display available commands
help:
	@echo "$(COLOR_INFO)Available Makefile commands for $(NAME):$(COLOR_RESET)"
	@echo "	$(COLOR_SUCCESS)make / make all$(COLOR_RESET)	Build and start containers in background"
	@echo "	$(COLOR_SUCCESS)make init$(COLOR_RESET)	Initialize production data directories in $(DATA_PATH)"
	@echo "	$(COLOR_SUCCESS)make up$(COLOR_RESET)		Start existing containers"
	@echo "	$(COLOR_SUCCESS)make down$(COLOR_RESET)	Stop and remove containers and networks"
	@echo "	$(COLOR_SUCCESS)make restart$(COLOR_RESET)	Restart all running containers"
	@echo "	$(COLOR_SUCCESS)make logs$(COLOR_RESET)	Follow container logs in real time"
	@echo "	$(COLOR_SUCCESS)make ps$(COLOR_RESET)		Show running containers and status"
	@echo "	$(COLOR_SUCCESS)make clean$(COLOR_RESET)	Stop containers and remove orphans"
	@echo "	$(COLOR_SUCCESS)make fclean$(COLOR_RESET)	Stop containers, remove volumes, images, and data"
	@echo "	$(COLOR_SUCCESS)make re$(COLOR_RESET)		Full reset and rebuild (fclean + all)"
	@echo "	$(COLOR_SUCCESS)make help$(COLOR_RESET)	Display this help message"
