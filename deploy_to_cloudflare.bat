@echo off
cd /d "C:\Users\user\.gemini\antigravity\scratch\wutaivocab"

echo ========================================================
echo   [1/2] Authenticating with Cloudflare...
echo ========================================================
echo If a browser tab opens, please click 'Allow'.
call npx wrangler login

echo.
echo ========================================================
echo   [2/2] Deploying to Cloudflare Pages (wutaivocab)...
echo ========================================================
call npx wrangler pages deploy dist --project-name=wutaivocab

echo.
echo ========================================================
echo   Finished! Press any key to close this window.
echo ========================================================
pause
