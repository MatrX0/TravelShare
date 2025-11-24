# TravelShare Docker Makefile
# Kolayca Docker komutlarını çalıştırmak için

.PHONY: help build up down restart logs clean dev prod status

# Varsayılan hedef - yardım menüsü
help:
	@echo "================================================"
	@echo "TravelShare Docker Komutları"
	@echo "================================================"
	@echo ""
	@echo "Kullanım: make [komut]"
	@echo ""
	@echo "Temel Komutlar:"
	@echo "  make prod          - Production ortamını başlat"
	@echo "  make dev           - Development ortamını başlat"
	@echo "  make up            - Tüm servisleri başlat"
	@echo "  make down          - Tüm servisleri durdur"
	@echo "  make restart       - Servisleri yeniden başlat"
	@echo "  make build         - Image'ları yeniden oluştur"
	@echo ""
	@echo "İzleme Komutları:"
	@echo "  make logs          - Logları göster"
	@echo "  make status        - Container durumunu göster"
	@echo "  make stats         - Kaynak kullanımını göster"
	@echo ""
	@echo "Temizlik Komutları:"
	@echo "  make clean         - Container'ları ve image'ları temizle"
	@echo "  make clean-all     - Tüm Docker kaynaklarını temizle"
	@echo ""

# Production ortamını başlat
prod:
	@echo "🚀 Production ortamı başlatılıyor..."
	docker-compose up -d travelshare-app
	@echo "✅ Production çalışıyor: http://localhost:3000"

# Development ortamını başlat
dev:
	@echo "🚀 Development ortamı başlatılıyor..."
	docker-compose --profile dev up -d travelshare-dev
	@echo "✅ Development çalışıyor: http://localhost:5173"

# Tüm servisleri başlat
up:
	@echo "🚀 Tüm servisler başlatılıyor..."
	docker-compose --profile dev up -d
	@echo "✅ Tüm servisler çalışıyor"

# Servisleri durdur
down:
	@echo "⏹️  Servisler durduruluyor..."
	docker-compose --profile dev down
	@echo "✅ Tüm servisler durduruldu"

# Servisleri yeniden başlat
restart:
	@echo "🔄 Servisler yeniden başlatılıyor..."
	docker-compose --profile dev restart
	@echo "✅ Servisler yeniden başlatıldı"

# Image'ları yeniden oluştur ve başlat
build:
	@echo "🏗️  Image'lar yeniden oluşturuluyor..."
	docker-compose build --no-cache
	docker-compose --profile dev up -d --build
	@echo "✅ Image'lar oluşturuldu ve servisler başlatıldı"

# Logları göster
logs:
	@echo "📝 Loglar görüntüleniyor (Ctrl+C ile çıkın)..."
	docker-compose --profile dev logs -f

# Container durumunu göster
status:
	@echo "📊 Container durumu:"
	docker-compose --profile dev ps

# Kaynak kullanımını göster
stats:
	@echo "📊 Kaynak kullanımı:"
	docker stats --no-stream

# Container'ları ve image'ları temizle
clean:
	@echo "🧹 Temizlik yapılıyor..."
	docker-compose --profile dev down -v
	docker image prune -f
	@echo "✅ Temizlik tamamlandı"

# Tüm Docker kaynaklarını temizle
clean-all:
	@echo "🧹 Tüm Docker kaynakları temizleniyor..."
	docker-compose --profile dev down -v
	docker system prune -af --volumes
	@echo "✅ Tam temizlik tamamlandı"

# Production image'ı oluştur
build-prod:
	@echo "🏗️  Production image oluşturuluyor..."
	docker build -t travelshare-app:latest .
	@echo "✅ Production image hazır"

# Development image'ı oluştur
build-dev:
	@echo "🏗️  Development image oluşturuluyor..."
	docker build -f Dockerfile.dev -t travelshare-dev:latest .
	@echo "✅ Development image hazır"

# Container içine gir (production)
shell-prod:
	@echo "🐚 Production container'a bağlanılıyor..."
	docker-compose exec travelshare-app sh

# Container içine gir (development)
shell-dev:
	@echo "🐚 Development container'a bağlanılıyor..."
	docker-compose exec travelshare-dev sh

# Docker Hub'a push et
push:
	@echo "📤 Docker Hub'a yükleniyor..."
	@read -p "Docker Hub kullanıcı adınız: " username; \
	docker tag travelshare-app:latest $$username/travelshare-app:latest; \
	docker push $$username/travelshare-app:latest
	@echo "✅ Image yüklendi"

# Health check
health:
	@echo "🏥 Sağlık kontrolü yapılıyor..."
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Production çalışıyor" || echo "❌ Production çalışmıyor"
	@curl -f http://localhost:5173 > /dev/null 2>&1 && echo "✅ Development çalışıyor" || echo "❌ Development çalışmıyor"
