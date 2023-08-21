import path from 'path';

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    proxy: {
        '/**' : {
            "target": "http://127.0.0.1:8888",
            "changeOrigin": true
        }
    }
}