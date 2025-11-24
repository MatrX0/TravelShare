#!/bin/bash

# TravelShare Docker Quick Start Script

echo "🐳 TravelShare - Docker Kurulum Script'i"
echo "========================================"
echo ""

# Docker kurulu mu kontrol et
if ! command -v docker &> /dev/null
then
    echo "❌ Docker kurulu değil!"
    echo "📥 Lütfen Docker'ı yükleyin: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker kurulu: $(docker --version)"
echo ""

# Docker Compose kurulu mu kontrol et
if ! command -v docker-compose &> /dev/null
then
    echo "❌ Docker Compose kurulu değil!"
    echo "📥 Lütfen Docker Compose'u yükleyin"
    exit 1
fi

echo "✅ Docker Compose kurulu: $(docker-compose --version)"
echo ""

# Kullanıcıdan seçim al
echo "Hangi ortamı çalıştırmak istersiniz?"
echo "1) Production (Üretim) - Port 3000"
echo "2) Development (Geliştirme) - Port 5173"
echo "3) Her ikisi"
echo ""
read -p "Seçiminiz (1-3): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Production ortamı başlatılıyor..."
    docker-compose up -d travelshare-app
    echo ""
    echo "✅ Başarılı! Uygulamanız çalışıyor:"
    echo "   🌐 http://localhost:3000"
    ;;
  2)
    echo ""
    echo "🚀 Development ortamı başlatılıyor..."
    docker-compose --profile dev up -d travelshare-dev
    echo ""
    echo "✅ Başarılı! Uygulamanız çalışıyor:"
    echo "   🌐 http://localhost:5173"
    ;;
  3)
    echo ""
    echo "🚀 Her iki ortam da başlatılıyor..."
    docker-compose --profile dev up -d
    echo ""
    echo "✅ Başarılı! Uygulamalarınız çalışıyor:"
    echo "   🌐 Production: http://localhost:3000"
    echo "   🌐 Development: http://localhost:5173"
    ;;
  *)
    echo "❌ Geçersiz seçim!"
    exit 1
    ;;
esac

echo ""
echo "📊 Container durumunu kontrol etmek için:"
echo "   docker-compose ps"
echo ""
echo "📝 Logları görmek için:"
echo "   docker-compose logs -f"
echo ""
echo "⏹️  Durdurmak için:"
echo "   docker-compose down"
echo ""
echo "✨ İyi çalışmalar!"
