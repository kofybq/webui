module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : './',
    devServer: {
        proxy: {
            '/dictapi': {
                target: 'http://45.32.130.153',
                ws: true,
                changeOrigin: true
            },
            '/stockapi': {
                target: 'http://127.0.0.1:5000',
                ws: true,
                changeOrigin: true
            },
            '/mp3': {
                target: 'http://45.32.130.153',
                ws: true,
                changeOrigin: true
            }
        }
    }
}