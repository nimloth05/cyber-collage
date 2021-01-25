module.exports = {
  chainWebpack: config => {
    config.optimization
      .minimizer("terser")
      .tap(args => {
        const {terserOptions} = args[0];
        // eslint-disable-next-line @typescript-eslint/camelcase
        terserOptions.keep_classnames = true;
        // eslint-disable-next-line @typescript-eslint/camelcase
        terserOptions.keep_fnames = true;
        return args;
      });
  },
};
