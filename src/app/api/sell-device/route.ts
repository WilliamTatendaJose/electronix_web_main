/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import sendgrid from '@sendgrid/mail';

// Configure SendGrid
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

// Email configuration
const sender = process.env.SENDER_EMAIL;
const receiver = process.env.RECIEVER_EMAIL;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Parse the FormData
    const formData = await req.formData();
    
    // Get form fields
    const deviceType = formData.get('deviceType') as string;
    const model = formData.get('model') as string;
    const condition = formData.get('condition') as string;
    const pickupRequired = formData.get('pickupRequired') === 'true';
    const address = formData.get('address') as string;
    const description = formData.get('description') as string;
    
    // Get the image file
    const imageFile = formData.get('image') as File | null;
    let attachment = null;

    // Process image if it exists
    if (imageFile) {
      const imageBuffer = await imageFile.arrayBuffer();
      attachment = {
        content: Buffer.from(imageBuffer).toString('base64'),
        filename: imageFile.name,
        type: imageFile.type,
        disposition: 'attachment',
      };
    }

    // Validate form data
    const errors: string[] = [];
    if (!deviceType || !['smartphone', 'laptop', 'tablet', 'console', 'desktop', 'other'].includes(deviceType)) {
      errors.push('Invalid device type');
    }
    if (!model || model.trim().length < 2) {
      errors.push('Invalid or missing device model');
    }
    if (!condition || !['excellent', 'good', 'fair', 'poor'].includes(condition)) {
      errors.push('Invalid device condition');
    }
    if (pickupRequired && (!address || address.trim().length < 10)) {
      errors.push('Invalid pickup address');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { message: 'Validation failed', errors }, 
        { status: 400 }
      );
    }

    // Construct email message
    const msg = {
      to: receiver!,
      from: sender!,
      subject: 'New Device Sell Request',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Device Sell Request</h2>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
              <p><strong>Device Type:</strong> ${deviceType}</p>
              <p><strong>Model:</strong> ${model}</p>
              <p><strong>Condition:</strong> ${condition}</p>
              ${pickupRequired ? `
                <p><strong>Pickup Required</strong></p>
                <p><strong>Pickup Address:</strong> ${address}</p>
              ` : '<p><strong>No Pickup Required</strong></p>'}
              <p><strong>Description:</strong> ${description || 'No additional description'}</p>
            </div>
          </body>
        </html>
      `,
      attachments: attachment ? [attachment] : [],
    };

    // Send email
    await sendgrid.send(msg);

    return NextResponse.json(
      { message: 'Device sell request submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: 'Unexpected error occurred', error: String(error) },
      { status: 500 }
    );
  }
}