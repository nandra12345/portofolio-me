@echo off
REM Auto Create Folder Structure for Portfolio
REM Jalankan file ini di root folder portfolio

echo ========================================
echo   Portfolio Folder Setup Script
echo ========================================
echo.

REM Create uploads folder
if not exist "uploads" (
    mkdir uploads
    echo [OK] Folder 'uploads' created
) else (
    echo [SKIP] Folder 'uploads' already exists
)

REM Create placeholder files
echo. > uploads\project1-screenshot.jpg.placeholder
echo. > uploads\project2-screenshot.jpg.placeholder
echo. > uploads\project3-screenshot.jpg.placeholder
echo. > uploads\project4-screenshot.jpg.placeholder
echo. > uploads\project5-screenshot.jpg.placeholder
echo. > uploads\project6-screenshot.jpg.placeholder

echo [OK] Placeholder files created

REM Create .htaccess for uploads folder (security)
(
echo # Protect uploads folder
echo Options -Indexes
echo.
echo # Allow only images
echo ^<FilesMatch "\.(jpg^|jpeg^|png^|gif^|webp)$"^>
echo     Order allow,deny
echo     Allow from all
echo ^</FilesMatch^>
) > uploads\.htaccess

echo [OK] .htaccess created in uploads folder

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy your project screenshots to 'uploads' folder
echo 2. Rename them to: project1-screenshot.jpg, project2-screenshot.jpg, etc
echo 3. Compress images with TinyPNG (tinypng.com)
echo 4. Edit index.html to update project links
echo.
echo See PROJECTS-GUIDE.md for detailed instructions
echo.
pause