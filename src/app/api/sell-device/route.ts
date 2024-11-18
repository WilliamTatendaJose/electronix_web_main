import { NextRequest, NextResponse } from 'next/server';
import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import formidable from 'formidable';
import fs from 'fs';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);
const sender= process.env.SENDER_EMAIL 
const reciever= process.env.RECIEVER_EMAIL 

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest): Promise<Response> {
  return new Promise<Response>((resolve) => {
    const form = new formidable.IncomingForm();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        resolve(NextResponse.json({ message: 'Form parsing error' }, { status: 500 }));
        return;
      }

      try {
        const formData = JSON.parse(fields.data as unknown as string);
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

        let attachment = null;
        if (imageFile) {
          const imageData = fs.readFileSync(imageFile.filepath);
          attachment = {
            content: imageData.toString('base64'),
            filename: imageFile.originalFilename || 'attachment',
            type: imageFile.mimetype || 'application/octet-stream',
            disposition: 'attachment',
          };
        }

        const msg: MailDataRequired = {
          to: reciever!, // replace with actual recipient email
          from: sender!, // replace with your verified sender email
          subject: 'New Device Sell Request',
          html: `
            <h2>New Device Sell Request</h2>
            <p><strong>Device Type:</strong> ${formData.deviceType}</p>
            <p><strong>Model:</strong> ${formData.model}</p>
            <p><strong>Condition:</strong> ${formData.condition}</p>
            ${formData.pickupRequired ? `<p><strong>Pickup Address:</strong> ${formData.address}</p>` : ''}
            <p><strong>Description:</strong> ${formData.description}</p>
          `,
          attachments: attachment ? [attachment] : [],
        };

        await sendgrid.send(msg);
        resolve(NextResponse.json({ message: 'Email sent successfully' }, { status: 200 }));
      } catch (error) {
        console.error('Error sending email:', error);
        resolve(NextResponse.json({ message: 'Error sending email' }, { status: 500 }));
      }
    });
  });
}