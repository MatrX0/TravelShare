# VPS Deploy Rehberi - Local'de Build, VPS'e Upload

## 🎯 Senaryonuz

Local Windows bilgisayarınızda build alıp VPS'e upload ediyorsunuz.

## ✅ Adım Adım Deploy

### 1. Local'de Production Build Alma

Windows PowerShell veya CMD'de:

```bash
# Proje klasörüne git
cd C:\Users\senol\OneDrive\Documents\TravelPlanningWeb\travel-planning-app

# Frontend build al
npm run build
```

✅ `.env.production` dosyası otomatik kullanılır:
```
VITE_API_URL=https://shareway.com.tr/api
```

✅ Build çıktısı: `dist/` klasöründe

### 2. dist/ Klasörünü VPS'e Upload Etme

#### Yöntem A: FileZilla/WinSCP ile (ÖNERİLEN ⭐)

1. **FileZilla** veya **WinSCP** programını açın
2. VPS'e bağlanın:
   - Host: `77.245.156.161`
   - Username: `root`
   - Password: VPS şifreniz
3. **Sol taraf (Local):** `C:\Users\senol\OneDrive\Documents\TravelPlanningWeb\travel-planning-app\dist\`
4. **Sağ taraf (VPS):** `/var/www/html/`
5. **dist/** içindeki TÜM dosyaları sürükle-bırak

#### Yöntem B: SCP Komutu ile

PowerShell'de:
```powershell
scp -r dist/* root@77.245.156.161:/var/www/html/
```

### 3. Test Et

1. Browser'da `https://shareway.com.tr` açın
2. F12 → Network tab
3. Weather API isteği şu şekilde olmalı:
   ```
   https://shareway.com.tr/api/weather/current ✅
   ```
4. ❌ DEĞİL: `localhost:8080/api/weather/current`

## 🚀 Hızlı Deploy Batch Script

`deploy-to-vps.bat` dosyası oluşturun:

```batch
@echo off
echo ====================================
echo    TravelShare VPS Deploy Script
echo ====================================
echo.

echo [1/2] Building frontend...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✅ Build completed!
echo.

echo [2/2] Uploading to VPS...
scp -r dist\* root@77.245.156.161:/var/www/html/
if errorlevel 1 (
    echo ERROR: Upload failed!
    pause
    exit /b 1
)

echo.
echo ====================================
echo    ✅ Deployment Successful!
echo ====================================
echo.
echo Check: https://shareway.com.tr
pause
```

Kullanmak için:
```bash
# Double-click veya CMD'de
deploy-to-vps.bat
```

## 🔧 Backend Deploy (Sadece Gerekirse)

Eğer backend kodları da değiştiyse:

```bash
# 1. Local'de Maven build
mvn clean package

# 2. JAR dosyasını VPS'e upload et
scp target/maps-0.0.1-SNAPSHOT.jar root@77.245.156.161:/home/yourapp/

# 3. VPS'de backend'i yeniden başlat
ssh root@77.245.156.161
pm2 restart spring-backend
```

## ✅ VPS'de Kontrol (SSH)

```bash
# VPS'e bağlan
ssh root@77.245.156.161

# Dosyalar upload edildi mi?
ls -la /var/www/html/

# Backend çalışıyor mu?
curl http://localhost:8080/api/health
pm2 list

# Nginx çalışıyor mu?
sudo systemctl status nginx
```

## 🐛 Sorun Giderme

### ❌ Hala localhost:8080 kullanıyorsa

Local'de kontrol edin:

```powershell
# Build içinde localhost var mı?
cd C:\Users\senol\OneDrive\Documents\TravelPlanningWeb\travel-planning-app
Select-String -Path "dist\assets\*.js" -Pattern "localhost:8080"
```

Eğer bulunursa:
```bash
# dist/ ve cache'i temizle
Remove-Item -Recurse -Force dist/, node_modules/.vite
npm run build
```

### ❌ .env.production dosyası yok

```bash
# Dosya var mı kontrol et
Test-Path .env.production

# Yoksa oluştur
echo "VITE_API_URL=https://shareway.com.tr/api" > .env.production
```

### ❌ SCP çalışmıyorsa

FileZilla/WinSCP kullanın veya:

```powershell
# Git Bash kullanın (Git for Windows ile gelir)
cd C:\Users\senol\OneDrive\Documents\TravelPlanningWeb\travel-planning-app
bash
scp -r dist/* root@77.245.156.161:/var/www/html/
```

## 📦 Tam Deploy Checklist

Local'de (Windows):
- [ ] `npm run build` çalıştırıldı
- [ ] `dist/` klasörü oluştu
- [ ] dist/ içinde dosyalar var (index.html, assets/, vb.)
- [ ] `.env.production` dosyası mevcut

VPS'e Upload:
- [ ] FileZilla/WinSCP ile dist/ içindeki dosyalar upload edildi
- [ ] `/var/www/html/` içinde dosyalar var

Test:
- [ ] `https://shareway.com.tr` açılıyor
- [ ] Weather API çalışıyor
- [ ] Console'da hata yok

## 💡 İpuçları

✅ **Her deploy'da sadece şunlar yeterli:**
```bash
npm run build
# FileZilla ile dist/ içindekileri upload et
```

✅ **Backend değişmediyse upload etmeyin** - Sadece frontend'i upload edin

✅ **Browser cache temizleyin:** Ctrl+Shift+Delete

✅ **Nginx cache temizlemek için (VPS'de):**
```bash
ssh root@77.245.156.161
sudo rm -rf /var/cache/nginx/*
sudo systemctl restart nginx
```

## 📝 Özet

1. **Local'de build:**
   ```bash
   npm run build
   ```

2. **FileZilla ile upload:**
   - `dist/*` → VPS `/var/www/html/`

3. **Test et:**
   - `https://shareway.com.tr` 
   - Weather API çalışıyor ✅

**Hepsi bu kadar!** 🎉
