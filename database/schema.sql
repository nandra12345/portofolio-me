-- Buat database baru
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- Tabel untuk komentar
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45) NULL COMMENT 'Untuk rate limiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_visible TINYINT(1) DEFAULT 1 COMMENT 'Untuk moderasi - 1=tampil, 0=hidden',
    INDEX idx_created (created_at),
    INDEX idx_visible (is_visible)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel untuk rate limiting (opsional - bisa pakai session/cache juga)
CREATE TABLE IF NOT EXISTS rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    last_comment_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    comment_count INT DEFAULT 1,
    UNIQUE KEY unique_ip (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert data dummy untuk testing
INSERT INTO comments (name, email, message, created_at) VALUES
('Budi Santoso', 'budi@example.com', 'Portfolio kamu keren banget! Design-nya modern dan loading-nya cepat. Sukses terus!', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('Siti Nurhaliza', NULL, 'Saya suka bagian skills-nya, sangat informatif. Boleh dong share source code-nya?', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('Ahmad Rizky', 'rizky.dev@gmail.com', 'Mantap! Fitur komentar live-nya smooth. Tech stack-nya apa aja ya?', DATE_SUB(NOW(), INTERVAL 30 MINUTE));

-- View untuk menampilkan komentar (optional - untuk kemudahan query)
CREATE OR REPLACE VIEW recent_comments AS
SELECT 
    id,
    name,
    LEFT(email, 3) as email_hint, -- hanya 3 karakter pertama untuk privacy
    message,
    created_at
FROM comments
WHERE is_visible = 1
ORDER BY created_at DESC
LIMIT 50;

-- Stored procedure untuk cleanup old rate limits (opsional)
DELIMITER //
CREATE PROCEDURE cleanup_old_rate_limits()
BEGIN
    DELETE FROM rate_limits 
    WHERE last_comment_at < DATE_SUB(NOW(), INTERVAL 1 DAY);
END //
DELIMITER ;

-- Event scheduler untuk auto cleanup (jalan otomatis setiap hari)
-- Uncomment jika MySQL event scheduler aktif
-- CREATE EVENT IF NOT EXISTS daily_cleanup
-- ON SCHEDULE EVERY 1 DAY
-- STARTS CURRENT_DATE + INTERVAL 1 DAY
-- DO CALL cleanup_old_rate_limits();

-- Grant permissions (sesuaikan dengan user MySQL kamu)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON portfolio_db.* TO 'portfolio_user'@'localhost';
-- FLUSH PRIVILEGES;