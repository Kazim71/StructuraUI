# Install Node.js dependencies
Write-Host "Installing dependencies..."
npm install

# Initialize Git repository
Write-Host "Initializing Git repository..."
git init
git add .
git commit -m "chore: initial Next.js and Supabase scaffold"

Write-Host "Setup complete!"
