/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// Configure SendGrid
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

// Email configuration
const sender = process.env.SENDER_EMAIL;
const receiver = process.env.RECIEVER_EMAIL;

// Disable body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data
const parseForm = (req: NextRequest): Promise<{ fields: Record<string, any>; files: Record<string, any> }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB file size limit
    });

    form.parse(req as any, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};

// Validate form data
const validateFormData = (formData: any): string[] => {
  const errors: string[] = [];

  // Device Type Validation
  if (!formData.deviceType || !['smartphone', 'laptop', 'tablet', 'console', 'desktop', 'other'].includes(formData.deviceType)) {
    errors.push('Invalid device type');
  }

  // Model Validation
  if (!formData.model || formData.model.trim().length < 2) {
    errors.push('Invalid or missing device model');
  }

  // Condition Validation
  if (!formData.condition || !['excellent', 'good', 'fair', 'poor'].includes(formData.condition)) {
    errors.push('Invalid device condition');
  }

  // Pickup Address Validation
  if (formData.pickupRequired && (!formData.address || formData.address.trim().length < 10)) {
    errors.push('Invalid pickup address');
  }

  return errors;
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Parse form data
    const { fields, files } = await parseForm(req);

    // Parse form data from JSON string
    let formData;
    try {
      formData = JSON.parse(fields.data as string);
    } catch {
      return NextResponse.json(
        { message: 'Invalid form data', errors: ['Unable to parse form data'] }, 
        { status: 400 }
      );
    }

    // Validate form data
    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validationErrors }, 
        { status: 400 }
      );
    }

    // Handle image file
    let attachment = null;
    const imageFile = files.image;
    
    if (imageFile instanceof File) {
      try {
        const imageData = await imageFile.arrayBuffer();
        const buffer = Buffer.from(imageData);
        attachment = {
          content: buffer.toString('base64'),
          filename: imageFile.name || 'device_image',
          type: imageFile.type || 'application/octet-stream',
          disposition: 'attachment',
        };
      } catch (imageError) {
        console.error('Image processing error:', imageError);
        // Continue without image attachment
      }
    }

    // Construct email message
    const msg: MailDataRequired = {
      to: receiver!, 
      from: sender!,
      subject: 'New Device Sell Request',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Device Sell Request</h2>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
              <p><strong>Device Type:</strong> ${formData.deviceType}</p>
              <p><strong>Model:</strong> ${formData.model}</p>
              <p><strong>Condition:</strong> ${formData.condition}</p>
              ${formData.pickupRequired ? `
                <p><strong>Pickup Required</strong></p>
                <p><strong>Pickup Address:</strong> ${formData.address}</p>
              ` : '<p><strong>No Pickup Required</strong></p>'}
              <p><strong>Description:</strong> ${formData.description || 'No additional description'}</p>
            </div>
          </body>
        </html>
      `,
      text: `
        New Device Sell Request
        Device Type: ${formData.deviceType}
        Model: ${formData.model}
        Condition: ${formData.condition}
        ${formData.pickupRequired ? `Pickup Address: ${formData.address}` : 'No Pickup Required'}
        Description: ${formData.description || 'No additional description'}
      `,
      attachments: attachment ? [attachment] : [],
    };

    // Send email
    try {
      await sendgrid.send(msg);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { message: 'Failed to send email', error: emailError }, 
        { status: 500 }
      );
    }

    // Handle image file
    if (imageFile && typeof imageFile === 'object' && 'filepath' in imageFile) {
      await fs.unlink(imageFile.filepath);
    }

    // Successful response
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