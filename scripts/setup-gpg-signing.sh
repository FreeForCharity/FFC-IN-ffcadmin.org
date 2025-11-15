#!/bin/bash
set -e

# Setup GPG Signing for GitHub Actions
# This script helps generate and configure GPG keys for commit signing

echo "🔐 GPG Commit Signing Setup"
echo "================================"
echo ""

# Check if GPG is installed
if ! command -v gpg > /dev/null 2>&1; then
    echo "❌ Error: GPG is not installed"
    echo "Install it with: apt-get install gnupg (Ubuntu/Debian) or brew install gnupg (macOS)"
    exit 1
fi

echo "✅ GPG is installed"
echo ""

# Get user input
read -p "Enter name for GPG key (e.g., github-actions[bot]): " GPG_NAME
read -p "Enter email for GPG key (e.g., 41898282+github-actions[bot]@users.noreply.github.com): " GPG_EMAIL

echo ""
echo "⚠️  Security Note: For automation, consider using a key without a passphrase"
echo "    or storing the passphrase securely in a secrets manager."
echo ""
read -p "Enter passphrase (leave empty for no passphrase): " -s GPG_PASSPHRASE
echo ""

# Generate GPG key configuration
cat > /tmp/gpg-key-config <<EOF
%echo Generating GPG key for commit signing
Key-Type: RSA
Key-Length: 4096
Name-Real: ${GPG_NAME}
Name-Email: ${GPG_EMAIL}
Expire-Date: 0
EOF

if [ -n "$GPG_PASSPHRASE" ]; then
    echo "Passphrase: ${GPG_PASSPHRASE}" >> /tmp/gpg-key-config
else
    echo "%no-protection" >> /tmp/gpg-key-config
fi

echo "%commit" >> /tmp/gpg-key-config
echo "%echo GPG key generated" >> /tmp/gpg-key-config

echo "📝 Generating GPG key..."
gpg --batch --generate-key /tmp/gpg-key-config

# Get the key ID using machine-readable format
KEY_ID=$(gpg --list-secret-keys --with-colons "${GPG_EMAIL}" | grep '^sec' | cut -d':' -f5)

if [ -z "$KEY_ID" ]; then
    echo "❌ Error: Failed to generate GPG key"
    exit 1
fi

echo "✅ Generated GPG key with ID: ${KEY_ID}"
echo ""

# Export keys
echo "📤 Exporting keys..."
echo ""

PUBLIC_KEY_FILE="/tmp/gpg-public-key.asc"
PRIVATE_KEY_FILE="/tmp/gpg-private-key.asc"

gpg --armor --export "${KEY_ID}" > "${PUBLIC_KEY_FILE}"
gpg --armor --export-secret-keys "${KEY_ID}" > "${PRIVATE_KEY_FILE}"

echo "✅ Keys exported:"
echo "   Public key:  ${PUBLIC_KEY_FILE}"
echo "   Private key: ${PRIVATE_KEY_FILE}"
echo ""

# Display next steps
echo "📋 Next Steps:"
echo "================================"
echo ""
echo "1. Add the PUBLIC key to GitHub account:"
echo "   - Go to https://github.com/settings/gpg/new"
echo "   - Copy and paste the content from: ${PUBLIC_KEY_FILE}"
echo ""
echo "2. Add the PRIVATE key to repository secrets:"
echo "   - Go to repository Settings → Secrets and variables → Actions"
echo "   - Create a new secret named: GPG_PRIVATE_KEY"
echo "   - Copy and paste the content from: ${PRIVATE_KEY_FILE}"
echo ""

if [ -n "$GPG_PASSPHRASE" ]; then
    echo "3. Add the passphrase to repository secrets:"
    echo "   - Create a new secret named: GPG_PASSPHRASE"
    echo "   - Value: [your passphrase]"
    echo ""
fi

echo "4. The workflows in .github/workflows/ will now automatically sign commits"
echo ""

echo "🔑 Your public key:"
echo "--------------------------------"
cat "${PUBLIC_KEY_FILE}"
echo "--------------------------------"
echo ""

echo "⚠️  SECURITY WARNING:"
echo "   - Keep the private key (${PRIVATE_KEY_FILE}) secure"
echo "   - Delete it after adding to GitHub secrets"
echo "   - Never commit private keys to the repository"
echo ""

# Cleanup
rm -f /tmp/gpg-key-config

echo "✅ Setup complete!"
echo ""
echo "To test signing locally:"
echo "  git config --global user.signingkey ${KEY_ID}"
echo "  git config --global commit.gpgsign true"
echo "  git commit -S -m \"Test signed commit\""
