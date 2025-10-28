<?php
/**
 * Auto Setup Script - Portfolio Website
 * 
 * Jalankan file ini sekali untuk setup otomatis:
 * http://localhost/portfolio/setup.php
 * 
 * HAPUS FILE INI setelah setup selesai untuk keamanan!
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Styling
echo '<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Setup</title>
    <style>
        body {
            font-family: "Segoe UI", Arial, sans-serif;
            background: linear-gradient(135deg, #0b1020 0%, #1a1f3a 100%);
            color: #e2e8f0;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 800px;
            margin: 50px auto;
            background: rgba(42, 42, 42, 0.8);
            padding: 40px;
            border-radius: 12px;
            border: 1px solid #2dd4bf;
            box-shadow: 0 0 30px rgba(45, 212, 191, 0.3);
        }
        h1 {
            color: #2dd4bf;
            margin-top: 0;
        }
        .step {
            background: #1a1a1a;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #2dd4bf;
        }
        .success {
            color: #86efac;
            background: #166534;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .error {
            color: #fca5a5;
            background: #7f1d1d;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .warning {
            color: #fcd34d;
            background: #78350f;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        code {
            background: #0a0a0a;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: "Courier New", monospace;
        }
        .status-icon {
            font-size: 24px;
            margin-right: 10px;
        }
        button {
            background: #2dd4bf;
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
        }
        button:hover {
            background: #5eead4;
        }
        pre {
            background: #0a0a0a;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">';

echo '<h1>🚀 Portfolio Setup Wizard</h1>';
echo '<p>Script ini akan setup database dan konfigurasi otomatis.</p>';

// Step 1: Check PHP Version
echo '<div class="step">';
echo '<h2>Step 1: Check PHP Version</h2>';
$phpVersion = phpversion();
if (version_compare($phpVersion, '7.4.0', '>=')) {
    echo '<div class="success"><span class="status-icon">✅</span>PHP Version: ' . $phpVersion . ' (OK)</div>';
} else {
    echo '<div class="error"><span class="status-icon">❌</span>PHP Version: ' . $phpVersion . ' (Minimum required: 7.4)</div>';
    echo '<p>Upgrade PHP untuk melanjutkan.</p>';
    die();
}
echo '</div>';

// Step 2: Check PDO Extension
echo '<div class="step">';
echo '<h2>Step 2: Check PDO Extension</h2>';
if (extension_loaded('pdo') && extension_loaded('pdo_mysql')) {
    echo '<div class="success"><span class="status-icon">✅</span>PDO dan PDO_MySQL tersedia</div>';
} else {
    echo '<div class="error"><span class="status-icon">❌</span>PDO atau PDO_MySQL tidak tersedia</div>';
    echo '<p>Enable extension di php.ini</p>';
    die();
}
echo '</div>';

// Step 3: Check config.php
echo '<div class="step">';
echo '<h2>Step 3: Check Configuration File</h2>';
if (file_exists('api/config.php')) {
    echo '<div class="success"><span class="status-icon">✅</span>File api/config.php ditemukan</div>';
    require_once 'api/config.php';
} else {
    echo '<div class="error"><span class="status-icon">❌</span>File api/config.php tidak ditemukan</div>';
    echo '<p>Buat file api/config.php sesuai template di .env.example</p>';
    die();
}
echo '</div>';

// Step 4: Test Database Connection
echo '<div class="step">';
echo '<h2>Step 4: Test Database Connection</h2>';
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo '<div class="success"><span class="status-icon">✅</span>Berhasil connect ke MySQL server</div>';
} catch (PDOException $e) {
    echo '<div class="error"><span class="status-icon">❌</span>Gagal connect ke MySQL</div>';
    echo '<pre>Error: ' . $e->getMessage() . '</pre>';
    echo '<div class="warning">⚠️ Pastikan MySQL running di XAMPP/WAMP</div>';
    die();
}
echo '</div>';

// Step 5: Create Database
echo '<div class="step">';
echo '<h2>Step 5: Create Database</h2>';
try {
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo '<div class="success"><span class="status-icon">✅</span>Database <code>' . DB_NAME . '</code> created/verified</div>';
} catch (PDOException $e) {
    echo '<div class="error"><span class="status-icon">❌</span>Gagal create database</div>';
    echo '<pre>Error: ' . $e->getMessage() . '</pre>';
}
echo '</div>';

// Step 6: Select Database
echo '<div class="step">';
echo '<h2>Step 6: Select Database</h2>';
try {
    $pdo->exec("USE " . DB_NAME);
    echo '<div class="success"><span class="status-icon">✅</span>Database selected</div>';
} catch (PDOException $e) {
    echo '<div class="error"><span class="status-icon">❌</span>Gagal select database</div>';
    echo '<pre>Error: ' . $e->getMessage() . '</pre>';
    die();
}
echo '</div>';

// Step 7: Create Tables
echo '<div class="step">';
echo '<h2>Step 7: Create Tables</h2>';

// Read SQL file
if (file_exists('database/schema.sql')) {
    $sql = file_get_contents('database/schema.sql');
    
    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($statements as $statement) {
        if (empty($statement) || strpos($statement, '--') === 0) {
            continue;
        }
        
        try {
            $pdo->exec($statement);
            $successCount++;
        } catch (PDOException $e) {
            // Ignore errors for statements that already exist
            if (strpos($e->getMessage(), 'already exists') === false) {
                $errorCount++;
                echo '<div class="error">Error: ' . $e->getMessage() . '</div>';
            }
        }
    }
    
    echo '<div class="success"><span class="status-icon">✅</span>SQL statements executed: ' . $successCount . ' success</div>';
    if ($errorCount > 0) {
        echo '<div class="warning">⚠️ Some statements failed: ' . $errorCount . ' (might be normal)</div>';
    }
} else {
    echo '<div class="error"><span class="status-icon">❌</span>File database/schema.sql tidak ditemukan</div>';
    echo '<p>Buat table manual via phpMyAdmin</p>';
}
echo '</div>';

// Step 8: Verify Tables
echo '<div class="step">';
echo '<h2>Step 8: Verify Tables</h2>';
try {
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) > 0) {
        echo '<div class="success"><span class="status-icon">✅</span>Tables found: ' . count($tables) . '</div>';
        echo '<ul>';
        foreach ($tables as $table) {
            echo '<li>' . $table;
            
            // Count rows
            $countStmt = $pdo->query("SELECT COUNT(*) FROM $table");
            $count = $countStmt->fetchColumn();
            echo ' (' . $count . ' rows)</li>';
        }
        echo '</ul>';
    } else {
        echo '<div class="warning">⚠️ No tables found. Run schema.sql manually.</div>';
    }
} catch (PDOException $e) {
    echo '<div class="error"><span class="status-icon">❌</span>Error checking tables</div>';
    echo '<pre>Error: ' . $e->getMessage() . '</pre>';
}
echo '</div>';

// Step 9: Test API Endpoint
echo '<div class="step">';
echo '<h2>Step 9: Test API Endpoint</h2>';
if (file_exists('api/comments.php')) {
    echo '<div class="success"><span class="status-icon">✅</span>File api/comments.php ditemukan</div>';
    echo '<p>Test endpoint: <code>api/comments.php?limit=5</code></p>';
} else {
    echo '<div class="error"><span class="status-icon">❌</span>File api/comments.php tidak ditemukan</div>';
}
echo '</div>';

// Final Summary
echo '<div class="step" style="border-color: #2dd4bf; background: rgba(45, 212, 191, 0.1);">';
echo '<h2>✨ Setup Complete!</h2>';
echo '<p><strong>Next Steps:</strong></p>';
echo '<ol>';
echo '<li>Hapus file <code>setup.php</code> ini untuk keamanan</li>';
echo '<li>Akses <a href="index.html" style="color: #2dd4bf;">index.html</a> untuk melihat portfolio</li>';
echo '<li>Test form komentar di bagian Comments</li>';
echo '<li>Ganti data placeholder (nama, link sosmed, skills, dll)</li>';
echo '<li>Deploy ke hosting jika sudah siap production</li>';
echo '</ol>';

echo '<div class="warning" style="margin-top: 20px;">';
echo '<strong>⚠️ IMPORTANT:</strong><br>';
echo 'File setup.php ini hanya untuk development. <strong>HAPUS</strong> file ini sebelum deploy ke production!';
echo '</div>';

echo '<button onclick="window.location.href=\'index.html\'">Buka Portfolio →</button>';
echo '</div>';

echo '</div></body></html>';
?>