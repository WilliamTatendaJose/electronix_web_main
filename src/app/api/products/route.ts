import { NextResponse } from 'next/server';
import client from '../../shop/client';

export async function GET() {
  try {
    const query = '*[_type == "product" && featured == true] { id, name, condition, originalPrice, refurbishedPrice, sustainabilityImpact, "image": image.asset->url }';
    const featuredProducts = await client.fetch(query);

    return NextResponse.json(featuredProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({ message: 'Error fetching featured products' }, { status: 500 });
  }
}
