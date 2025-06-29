# Blog Content Management

This directory contains MDX blog posts for the portfolio website.

## File Structure

```
content/blog/
├── README.md                                    # This file
├── building-scalable-nextjs-applications.mdx   # Featured post
├── cloud-architecture-aws-best-practices.mdx   # Featured post  
├── modern-data-engineering-pipelines.mdx       # Regular post
└── ux-design-principles-for-developers.mdx     # Regular post
```

## Adding New Blog Posts

1. Create a new `.mdx` file in this directory
2. Use the following frontmatter template:

```yaml
---
title: "Your Blog Post Title"
description: "Brief description for SEO and previews"
date: "YYYY-MM-DD"
author: "Mikhail Ajaj"
category: "Category Name"
tags: ["tag1", "tag2", "tag3"]
featured: false
image: "/blog/image-name.jpg"
excerpt: "Custom excerpt if different from auto-generated one"
---
```

## Frontmatter Fields

- **title**: The blog post title (required)
- **description**: SEO description and social media preview
- **date**: Publication date in YYYY-MM-DD format
- **author**: Author name (defaults to "Mikhail Ajaj")
- **category**: Post category for filtering
- **tags**: Array of tags for filtering and SEO
- **featured**: Boolean - whether to show in featured posts section
- **image**: Optional hero image path
- **excerpt**: Optional custom excerpt (auto-generated if not provided)

## Categories

Current categories in use:
- Full-Stack Development
- Cloud Architecture  
- Data Engineering
- UX Design

## Writing Guidelines

1. Use clear, descriptive headings (H1, H2, H3)
2. Include code examples with proper syntax highlighting
3. Add practical implementation tips
4. Keep paragraphs concise and scannable
5. Include real-world examples and use cases
6. End with key takeaways or conclusions

## Image Assets

Blog images should be placed in `/public/blog/` directory and referenced as `/blog/image-name.jpg` in the frontmatter.

## SEO Optimization

- Use descriptive titles (50-60 characters)
- Write compelling descriptions (150-160 characters)  
- Include relevant keywords in tags
- Use proper heading hierarchy
- Add alt text to images