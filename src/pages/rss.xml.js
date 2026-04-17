import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // 获取所有文章
  const posts = await getCollection('posts');
  
  // 按时间倒序排序（最新的在最上面）
  posts.sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  return rss({
    // 输出的 XML 里的网站标题
    title: '紫光的现代小窝 | AeroDreams',
    // 网站的描述信息
    description: '业余计算机爱好者 / 硬件 DIY / furry / 赛博拾荒者 / 偶尔写写小说',
    // 你的网站域名 (会从 astro.config.mjs 中读取，如果没有配置请暂时填死，比如 'https://你的域名.com')
    site: context.site || 'https://你的域名.com',
    
    // 遍历所有文章并生成 RSS 节点
    items: posts.map((post) => ({
      title: post.data.title || '无标题日志',
      pubDate: new Date(post.data.date),
      description: post.data.description || '该系统日志暂无摘要...',
      // 生成文章的最终链接
      link: `/posts/${post.id}/`,
    })),
    
    // 设定语言为简体中文
    customData: `<language>zh-cn</language>`,
  });
}