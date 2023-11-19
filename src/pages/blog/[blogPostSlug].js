// src/pages/blog/[blogPostSlug].js
import BlogPostTemplate from '/src/components/BlogPostTemplate.js';

export async function getStaticProps(context) {
    const blogPostSlug = context.params.blogPostSlug;
    let data = null;
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getBlogPosts/?slug=${blogPostSlug}`);
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      data = await res.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    }
  
    // Extract the first element from the data array to get the specific blog post data
    const blogPostData = data.data[0];
  
    return {
      props: {
        data: blogPostData,
      },
    };
  }
  

export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getBlogPosts`);
    if (!res.ok) {
      throw new Error('Network response was not ok ' + res.statusText);
    }
    const data = await res.json();

    const paths = data.data
      .filter(post => post.slug && typeof post.slug === 'string')
      .map((post) => ({
        params: { blogPostSlug: post.slug },
      }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error fetching blog post slugs:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

function BlogPost({ data }) {
  const pageTitle = data?.title;
  const pageDescription = data?.description;
  const pageSubtitle = data?.subtitle;
  const content = data?.content;

  // Create breadcrumb data
const breadcrumbs = [
  { label: 'Home', url: '/' },
  { label: 'Blog', url: '/blog/' },
  { label: pageTitle && pageTitle.length > 15 ? `${pageTitle.substring(0, 15)}...` : pageTitle }
];


  return (
    <BlogPostTemplate 
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      pageSubtitle={pageSubtitle}
      content={content}
      author={data.author} // Pass the author data if available
      featuredImage={data.featuredImage} // Pass the featuredImage data if available
      summary={data.summary} // Pass the summary data if available
      tags={data.tags} // Pass the tags data if available
      publishedDate={data.publishedDate} // Pass the publishedDate data if available
      breadcrumbs={breadcrumbs} // Pass the breadcrumbs data
      blogPostMeta={data.blogPostMeta} // pass the blog post meta identifier
    />
  );
}

export default BlogPost;