/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { domains: ['lh3.googleusercontent.com', 'profile.line-scdn.net', 'firebasestorage.googleapis.com'] },
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://career.iwsif.org' : '',
    trailingSlash: true,
};
export default nextConfig;
