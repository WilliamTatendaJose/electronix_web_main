import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'your_project_id', // Replace with your Sanity project ID
  dataset: 'your_dataset_name', // Replace with your Sanity dataset name
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2023-10-01', // Use a specific API version
});

const getFeaturedProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = '*[_type == "product" && featured == true] { id, name, condition, originalPrice, refurbishedPrice, sustainabilityImpact, "image": image.asset->url }';
    const featuredProducts = await client.fetch(query);

    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error fetching featured products' });
  }
};

export default getFeaturedProducts; 