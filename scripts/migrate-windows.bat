@echo off
echo 🔧 TPID Database Setup
echo ======================

if "%DATABASE_URL%"=="" (
    echo ❌ DATABASE_URL not set. Using default SQLite.
    set DATABASE_URL=file:./dev.db
)

echo 📦 Generating Prisma Client...
call npx prisma generate

echo 🗄️ Pushing schema to database...
call npx prisma db push

echo 🌱 Seeding database...
call node prisma\seed.js

echo.
echo ✅ Database setup complete!
echo    Database: %DATABASE_URL%
