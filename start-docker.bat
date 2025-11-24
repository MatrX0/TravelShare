@echo off
REM TravelShare Docker Quick Start Script (Windows)

echo ================================
echo TravelShare - Docker Kurulum
echo ================================
echo.

REM Docker kurulu mu kontrol et
docker --version >nul 2>&1
if errorlevel 1 (
    echo [HATA] Docker kurulu degil!
    echo Lutfen Docker'i yukleyin: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker kurulu
docker --version
echo.

REM Docker Compose kurulu mu kontrol et
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [HATA] Docker Compose kurulu degil!
    pause
    exit /b 1
)

echo [OK] Docker Compose kurulu
docker-compose --version
echo.

REM Kullanıcıdan seçim al
echo Hangi ortami calistirmak istersiniz?
echo 1) Production (Uretim) - Port 3000
echo 2) Development (Gelistirme) - Port 5173
echo 3) Her ikisi
echo.
set /p choice="Seciminiz (1-3): "

if "%choice%"=="1" (
    echo.
    echo Production ortami baslatiliyor...
    docker-compose up -d travelshare-app
    echo.
    echo [BASARILI] Uygulamaniz calisiyor:
    echo    http://localhost:3000
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Development ortami baslatiliyor...
    docker-compose --profile dev up -d travelshare-dev
    echo.
    echo [BASARILI] Uygulamaniz calisiyor:
    echo    http://localhost:5173
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Her iki ortam da baslatiliyor...
    docker-compose --profile dev up -d
    echo.
    echo [BASARILI] Uygulamalariniz calisiyor:
    echo    Production: http://localhost:3000
    echo    Development: http://localhost:5173
    goto end
)

echo [HATA] Gecersiz secim!
pause
exit /b 1

:end
echo.
echo Container durumunu kontrol etmek icin:
echo    docker-compose ps
echo.
echo Loglari gormek icin:
echo    docker-compose logs -f
echo.
echo Durdurmak icin:
echo    docker-compose down
echo.
echo Iyi calismalar!
pause
