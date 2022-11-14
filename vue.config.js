const publicPath = process.env.NODE_ENV === 'production' ? '/review/' : '/'


const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: publicPath,
  pwa: {
    name: 'Review',
    //  themeColor: '#4DBA87',
    //  msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    // manifestOptions: {
    //   share_target: {
    //     action: publicPath,
    //     method: "GET",
    //     enctype: "application/x-www-form-urlencoded",
    //     params: {
    //       title: "title",
    //       text: "text",
    //       url: "url"
    //     }
    //   },
    // }
  },
})
