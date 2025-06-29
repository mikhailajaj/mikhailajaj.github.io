import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  featured: boolean;
  image?: string;
  content: string;
  readingTime: string;
  excerpt: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        // Calculate reading time
        const readingTimeResult = readingTime(content);
        
        // Generate excerpt from content (first 160 characters)
        const excerpt = content.replace(/[#*`]/g, '').substring(0, 160) + '...';

        return {
          slug,
          title: data.title || '',
          description: data.description || '',
          date: data.date || '',
          author: data.author || 'Mikhail Ajaj',
          tags: data.tags || [],
          category: data.category || 'General',
          featured: data.featured || false,
          image: data.image || '',
          content,
          readingTime: readingTimeResult.text,
          excerpt: data.excerpt || excerpt,
        } as BlogPost;
      });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const readingTimeResult = readingTime(content);
    const excerpt = content.replace(/[#*`]/g, '').substring(0, 160) + '...';

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      author: data.author || 'Mikhail Ajaj',
      tags: data.tags || [],
      category: data.category || 'General',
      featured: data.featured || false,
      image: data.image || '',
      content,
      readingTime: readingTimeResult.text,
      excerpt: data.excerpt || excerpt,
    } as BlogPost;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(post => post.featured).slice(0, 3);
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}

export function getAllCategories(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const categories = new Set<string>();
    
    fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .forEach((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        if (data.category) {
          categories.add(data.category);
        }
      });
    
    return Array.from(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export function getAllTags(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const tags = new Set<string>();
    
    fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .forEach((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => tags.add(tag));
        }
      });
    
    return Array.from(tags);
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
}