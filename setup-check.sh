#!/bin/bash
# ClipVault Quick Setup Script

echo "🎬 ClipVault - Production Setup Checker"
echo "======================================"
echo ""

# Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js $NODE_VERSION installed"
else
    echo "   ❌ Node.js not found"
    echo "   → Install from https://nodejs.org/"
    exit 1
fi

# Check npm
echo ""
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm $NPM_VERSION installed"
else
    echo "   ❌ npm not found"
    exit 1
fi

# Check Python
echo ""
echo "3️⃣  Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "   ✅ Python $PYTHON_VERSION installed"
else
    if command -v python &> /dev/null; then
        PYTHON_VERSION=$(python --version)
        echo "   ✅ Python $PYTHON_VERSION installed"
    else
        echo "   ⚠️  Python not found (needed for direct downloads)"
        echo "   → Install from https://www.python.org/downloads/"
        echo "   → (App will still work with fallback services)"
    fi
fi

# Check yt-dlp
echo ""
echo "4️⃣  Checking yt-dlp..."
if command -v yt-dlp &> /dev/null; then
    YTDLP_VERSION=$(yt-dlp --version)
    echo "   ✅ yt-dlp $YTDLP_VERSION installed"
else
    echo "   ⚠️  yt-dlp not installed"
    echo "   → Optional for direct downloads"
    echo "   → Install with: pip install yt-dlp"
fi

# Check dependencies
echo ""
echo "5️⃣  Checking npm dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ Dependencies installed"
else
    echo "   ⚠️  Dependencies not installed"
    echo "   → Run: npm install"
fi

# Check build
echo ""
echo "6️⃣  Checking build..."
if [ -d "dist" ]; then
    echo "   ✅ Production build ready"
else
    echo "   ⚠️  Build not found"
    echo "   → Run: npm run build"
fi

echo ""
echo "======================================"
echo "✅ Setup Check Complete!"
echo ""
echo "Next Steps:"
echo "  1. npm run dev        # Start frontend (http://localhost:3007)"
echo "  2. npm run api        # Start backend (http://localhost:5000)"
echo "  3. Open browser and test"
echo ""
echo "For production deployment:"
echo "  → Read DEPLOYMENT.md for Netlify + Railway setup"
echo ""
