const withOffline = require('next-offline');
const path = require('path');

const rewrites = async () => {
    const ret = [];

    return {
        beforeFiles: ret,
    };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    transpilePackages: [],
    reactStrictMode: true,
    publicRuntimeConfig: {
        apiPath: '/api/',
        backendOrigin: process.env.NEXT_PUBLIC_BACKEND_URL,
    },
    rewrites,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    generateSw: false,
    // dontAutoRegisterSw: true,
    generateInDevMode: true,
    workboxOpts: {
        swSrc: './serviceWorker.js',
        mode: process.env.NODE_ENV,
        swDest: path.resolve(__dirname, './public/service-worker.js'),
        maximumFileSizeToCacheInBytes: 7 * 1024 * 1024,
        include: [
            _ => {
                if (/^static\//.test(_.asset.name) && !/\[.*\]/.test(_.asset.name))
                    return /^static\//.test(_.asset.name) && !/\[.*\]/.test(_.asset.name);
            },
        ],
    },
    experimental: {
        proxyTimeout: 1000 * 120,
    },
};

module.exports = withOffline(nextConfig);
