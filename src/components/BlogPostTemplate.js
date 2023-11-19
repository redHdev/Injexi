import React from 'react';
import HeadMeta from '/src/components/HeadMeta.js';

function BlogPostTemplate({ 
  pageTitle, 
  content,
  author, // Assuming that author information is available in the data passed as props
  featuredImage, // Assuming that featuredImage is available in the data passed as props
  tags, // Assuming that tags information is available in the data passed as props
  publishedDate, // Assuming that publishedDate is available in the data passed as props
  breadcrumbs, // Assuming that breadcrumbs information is available in the data passed as props
  blogPostMeta,
  
}) {

  return (
    <div><HeadMeta page={blogPostMeta} />
    <div className="container">
        <div className="inside-article">
            {breadcrumbs && (
                <nav aria-label="breadcrumb" className="breadcrumb-nav">
                <div className="breadcrumb">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="breadcrumb-item">
                      {crumb.url ? <a href={crumb.url}>{crumb.label}</a> : crumb.label}
                      {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">{'  >  '}</span>}
                    </span>
                  ))}
                </div>
              </nav>               
            )}
            <h1>{pageTitle}</h1>
            {author && <p>By: {author.name}</p>}
            {featuredImage && <img src={featuredImage} alt={pageTitle} />}
            <div dangerouslySetInnerHTML={{ __html: content }} />

            <hr className="custom-hr"></hr>
            <p><i className="fa-solid fa-angles-left"></i>&nbsp;<a href="/au/blog/">Return to Blog</a></p>
            {tags && <p className="blog-card-p"><i className="fa-solid fa-tag"></i> &nbsp; {tags.join(', ')}</p>}
        </div>
    </div>
    </div>
  );
}

export default BlogPostTemplate;