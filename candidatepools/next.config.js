// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'profile.line-scdn.net',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
        ],
    },
    trailingSlash: true,
    // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://career.iwsif.org' : '', // Comment out or remove
};

module.exports = nextConfig;
