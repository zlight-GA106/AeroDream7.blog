import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 这是为 RSS 订阅引擎准备的绝对域名（请确保替换为你最终真实的域名）
  site: 'https://zlight106.top',

  markdown: {
    shikiConfig: {
      // 魔法指令：将默认的暗色高亮切换为亮色，完美契合 Frutiger Aero
      theme: 'github-light',
      // 如果你喜欢代码块没有多余的背景色填充，可以加上这句
      wrap: true 
    }
  }
});