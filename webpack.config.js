const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: "url-loader",
        options: {
          name: "[name].[ext]?[hash]",
          limit: 10000, // 10Kb
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
      Build Date: ${new Date().toLocaleString()}
      Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
      Author: ${childProcess.execSync("git config user.name")}
    `,
    }),
    new webpack.DefinePlugin({
      TWO: "1+1", // 전역 변수(코드 사용일 경우)로 사용이 가능하다.
      THREE: JSON.stringify("1+1"), // 전역 변수(문자열 사용일 경우)로 사용이 가능하다.
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        // html에서 사용 가능한 변수를 만들 수 있다.
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "(운영)",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              // 운영환경에서만 진행하는게 디버깅하기 편하다.
              collapseWhitespace: true, // 공백제거해서 html파일을 한줄로 만들어준다.
              removeComments: true, // html파일 주석 제거
            }
          : false,
    }),
    new CleanWebpackPlugin(), // 빌드 이전 결과물을 제거하는 플러그인
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin()]
      : []), // 번들러에서 css파일만 따로 뽑아낼때 사용한다.
  ],
  /**
   * TODO: 아래 플러그인을 추가해서 번들 결과를 만들어 보세요.
   * 1. BannerPlugin: 결과물에 빌드 시간을 출력하세요.
   * 2. HtmlWebpackPlugin: 동적으로 html 파일을 생성하세요.
   * 3. CleanWebpackPlugin: 빌드 전에 아웃풋 폴더를 깨끗히 정리하세요.
   * 4. MiniCssExtractPlugin: 모듈에서 css 파일을 분리하세요.
   */
};
