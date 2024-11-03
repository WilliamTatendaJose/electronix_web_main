import type { NextApiRequest, NextApiResponse } from 'next';
import client from  "../../shop/client";



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