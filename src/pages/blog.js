import React from 'react';
import HeadMeta from '/src/components/HeadMeta.js';

export async function getStaticProps() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getBlogPosts`);
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      const data = await res.json();
      
      return {
        props: {
          data: data.data,
        },
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return {
        props: {
          data: [],
        },
      };
    }
  }

function Blog({ data }) {
  if (!data || data.length === 0) {
    return <p>No blog posts found.</p>;
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
      suffix = 'st';
    } else if (day === 2 || day === 22) {
      suffix = 'nd';
    } else if (day === 3 || day === 23) {
      suffix = 'rd';
    }
  
    return `${month} ${day}${suffix},  ${year}`;
  }

  return (
    <div>
    <HeadMeta page="blog" />
    <div className="container">
      <h1>Cosmetic Treatment Blog</h1>
      <p>Welcome to the Injexi Cosmetic Treatment Blog 💉</p>
      <p>We cover all topics related to cosmetic treatments for the face, body and everywhere in between.</p>
      <hr className="custom-hr"></hr>
      <div className="blog-container">
      
        {data.map((post) => (
          <div key={post.slug} className="blog-card">
            <a href={`/blog/${post.slug}/`}><h2>{post.title}</h2></a>
            <a href={`/blog/${post.slug}/`}>{post.featuredImage && <img src={post.featuredImage} alt={post.title} />}</a>
            <p>{post.description}</p>

            {/* Adding author, published date, and tags */}
            
            {post.publishedDate && <p className="blog-card-p"> <i className="fa-regular fa-calendar"> &nbsp; </i>{formatDate(post.publishedDate)}</p>}
            {post.tags && <p className="blog-card-p"><i className="fa-solid fa-tag"></i> &nbsp; {post.tags.join(', ')}</p>}
            

            {/* Adding a small description or summary */}
            {post.summary && <p>{post.summary}..</p>}

            

            {/* Add a link to navigate to the blog post page */}
            <button className="blog-card-button" onClick={() => window.location.href=`/blog/${post.slug}`}>Read more</button>


          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Blog;
