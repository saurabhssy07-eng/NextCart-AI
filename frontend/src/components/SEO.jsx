import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'NextCart AI - Smart E-Commerce', 
  description = 'Experience the future of shopping with NextCart AI. Smart recommendations, fast checkout, and premium quality products.',
  name = 'NextCart AI',
  type = 'website',
  url = typeof window !== 'undefined' ? window.location.href : 'https://nextcart-ai.com',
  image = 'https://nextcart-ai.com/og-image.jpg' // In a real app, point to a real image
}) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card tags */}
      <meta name="twitter:creator" content="@nextcart" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
