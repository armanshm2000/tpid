#!/bin/bash
set -e

echo "🔧 TPID Database Setup"
echo "======================"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set. Using default SQLite."
  export DATABASE_URL="file:./dev.db"
fi

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🗄️ Pushing schema to database..."
npx prisma db push

echo "🌱 Seeding database..."
if command -v node &> /dev/null; then
  node prisma/seed.js
else
  echo "⚠️ Node.js not found. Skipping seed."
fi

echo ""
echo "✅ Database setup complete!"
echo "   Database: $DATABASE_URL"
