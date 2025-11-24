-- TravelShare için özel kullanıcı oluştur
CREATE USER IF NOT EXISTS 'travelshare_user'@'localhost' 
IDENTIFIED BY 'travelshare_password';

-- Bu kullanıcıya travelshare database'inde tam yetki ver
GRANT ALL PRIVILEGES ON travelshare.* TO 'travelshare_user'@'localhost';

-- Değişiklikleri uygula
FLUSH PRIVILEGES;

-- Kontrol et
SELECT user, host FROM mysql.user WHERE user = 'travelshare_user';