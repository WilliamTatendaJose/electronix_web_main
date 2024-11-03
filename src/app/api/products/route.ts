import { NextResponse } from 'next/server';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import client from '../../shop/client';

// Extract client config to use for image URL building
const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export async function GET() {
  try {
    const query = `*[_type == "refurbishedDevice"] {
      _id,
      name,
      condition,
      originalPrice,
      refurbishedPrice,
      sustainabilityImpact,
      inStock,
      mainImage,
      "savings": round(((originalPrice - refurbishedPrice) / originalPrice) * 100)
    } | order(refurbishedPrice asc)`;

    const featuredProducts = await client.fetch(query);
    // Generate image URLs using the `urlFor` function
    const productsWithImageUrls = featuredProducts.map((product: { mainImage: SanityImageSource | null }) => ({
      ...product,
      imageUrl: product.mainImage ? urlFor(product.mainImage)?.url() : null
    }));

    return NextResponse.json(productsWithImageUrls, { status: 200 });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({ message: 'Error fetching featured products' }, { status: 500 });
  }
}
