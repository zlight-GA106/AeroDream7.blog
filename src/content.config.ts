import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders'; 

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  
  schema: z.object({
    // catch: 如果没写或者写错了，不会报错导致文章消失，而是自动使用备用值
    title: z.string().catch('无标题文章'),
    description: z.string().catch('该文章暂无摘要...'),
    author: z.string().catch('zlight106'),
    
    // 防弹日期：如果完全没写 date 字段，默认给个 2000-01-01 保底
    date: z.coerce.date().catch(() => new Date('2000-01-01')), 
    
    // 防弹标签：不管你写的是字符串 tags: ROS，还是数组 tags: ["ROS"]，都能智能处理
    tags: z.any().transform(val => {
      if (Array.isArray(val)) return val.map(String);
      if (typeof val === 'string') return [val];
      return ['未分类'];
    }).catch(['未分类']),
  }),
});

export const collections = {
  'posts': postsCollection,
};