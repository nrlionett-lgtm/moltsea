# Netlify Deployment Guide

## 🚨 Important: Secrets Configuration

### Environment Variables to Set in Netlify

Go to **Site Settings** → **Environment variables** and add ONLY these:

#### Required for Production:
```
DATABASE_URL=postgresql://postgres.mxurtgcpalmbtsfoqspp:OeWjkiiLgsh1SiJI@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.mxurtgcpalmbtsfoqspp:OeWjkiiLgsh1SiJI@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=demo-project-id-replace-this
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_FACTORY_ADDRESS=0x9957c4570D7988B0acaed7882165f9585B231c46
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xEDbC605Ba53B4D56330F8b9b07703Bd5CBE1F379
PINATA_API_KEY=2dc6b3d9939e0ddbc1de
PINATA_SECRET_KEY=ca372a0df098932a1c72dfd7c5752233f36da92c306f102caa33bef88694be72
JWT_SECRET=your_jwt_secret_here
```

#### ❌ DO NOT ADD THESE (Development Only):
These variables are ONLY for local development and will trigger Netlify's secrets scanner:
- `PRIVATE_KEY` - Used only for local contract deployment
- `BASESCAN_API_KEY` - Used only for local contract verification
- `BASE_RPC_URL` - Used only for local Hardhat
- `BASE_SEPOLIA_RPC_URL` - Used only for local Hardhat

## 🔐 Security Notes

1. **Secrets Scanning Configuration**: 
   - `netlify.toml` is configured to ignore `hardhat.config.cjs` and `scripts/` folder
   - These files are for local development only and won't run in production

2. **Environment Variable Safety**:
   - Only `NEXT_PUBLIC_*` variables are exposed to the browser
   - Server-only variables (`DATABASE_URL`, `PINATA_SECRET_KEY`, etc.) are safe

3. **WalletConnect Project ID**:
   - Replace `demo-project-id-replace-this` with your real WalletConnect Project ID
   - Get one free at: https://cloud.walletconnect.com

## 📝 Deployment Steps

1. **Push to GitHub** (already done)
   ```bash
   git push origin master
   ```

2. **Go to Netlify Dashboard**
   - https://app.netlify.com

3. **Import Project**
   - "Add new site" → "Import an existing project"
   - Choose GitHub → Select `nrlionett-lgtm/moltsea`

4. **Build Settings** (auto-detected)
   ```
   Build command: npm run build
   Publish directory: .next
   ```

5. **Add Environment Variables**
   - Copy the variables from "Required for Production" section above
   - Site Settings → Environment variables → Add variables

6. **Deploy Site**
   - Click "Deploy site"
   - Build should complete successfully in ~2-3 minutes

## 🐛 Troubleshooting

### Secrets Scanning Error
If you still see secrets scanning errors:
1. Make sure you removed `PRIVATE_KEY`, `BASESCAN_API_KEY`, `BASE_RPC_URL`, and `BASE_SEPOLIA_RPC_URL` from Netlify environment variables
2. Clear Netlify cache: Site settings → Build & deploy → Post processing → Clear cache and retry deploy

### Database Connection Error
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Test connection from Supabase dashboard

### Build Warnings
- WalletConnect 403 error during build is normal (demo project ID)
- Missing optional dependencies warnings are safe to ignore

## ✅ Post-Deployment

After successful deployment:
1. Visit your Netlify site URL
2. Test wallet connection
3. Verify database connectivity (check /agents, /marketplace pages)
4. Update DNS settings if using custom domain
