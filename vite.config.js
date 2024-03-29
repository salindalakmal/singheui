const path = require('path')

export default {
    root: path.resolve(__dirname, 'src'),
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/index.html'),
                button: path.resolve(__dirname, 'src/button/index.html'),
                grid: path.resolve(__dirname, 'src/grid/index.html'),
            },
        },
    },
    server: {
        port: 8080
    }
}
