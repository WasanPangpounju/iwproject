/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com', 'profile.line-scdn.net', 'firebasestorage.googleapis.com']
    },
    reactStrictMode: true,       // Enables React strict mode
    swcMinify: true,             // Enables SWC-based minification
    trailingSlash: true,         // Ensures URLs end with a slash
    // Uncomment basePath if app is hosted in a subdirectory:
    // basePath: '/career.iwsif.org/iwproject/candidatepools',
};

export default nextConfig;
