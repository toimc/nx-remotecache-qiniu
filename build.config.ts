import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  outDir: 'dist',
  declaration: false,
  clean: true,
  failOnWarn: false,
  sourcemap: false,
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true
    }
  }
})
