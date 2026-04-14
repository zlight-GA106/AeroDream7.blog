import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      // 魔法指令：将默认的暗色高亮切换为亮色，完美契合 Frutiger Aero
      theme: 'github-light',
      // 如果你喜欢代码块没有多余的背景色填充，可以加上这句
      wrap: true 
    }
  }
});