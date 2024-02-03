const path = require('path')

export default {
    root: path.resolve(__dirname, 'src'),
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/index.html'),
                button: path.resolve(__dirname, 'src/button.html'),
                grid: path.resolve(__dirname, 'src/grid.html'),
            },
        },
    },
    server: {
        port: 8080
    }
}
