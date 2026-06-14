.PHONY: up down build logs dev-backend dev-frontend reset

# Chạy toàn bộ stack (lần đầu build image)
up:
	docker compose up -d --build

# Tắt stack
down:
	docker compose down

# Chỉ build images, không chạy
build:
	docker compose build

# Xem logs realtime
logs:
	docker compose logs -f

# Xem log từng service
logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-gateway:
	docker compose logs -f api-gateway

# Chạy backend local (cần mysql đang chạy)
dev-backend:
	./gradlew :backend:bootRun

# Chạy frontend local
dev-frontend:
	cd frontend && npm run dev

# Reset hoàn toàn: xóa containers + volumes
reset:
	docker compose down -v
	docker compose up -d --build

# Xem status
status:
	docker compose ps
