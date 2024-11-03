/* eslint-disable import/no-anonymous-default-export */
import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import formidable from 'formidable';
import fs from 'fs';
import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

// Disable body parsing (needed for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
    if (err) {
      return res.status(500).json({ message: 'Form parsing error' });
    }
    try {
      const formData = JSON.parse(fields.data as unknown as string);
      const imageFile = files.image as unknown as formidable.File;

      let attachment = null;
      if (imageFile) {
        const imageData = fs.readFileSync(imageFile.filepath);
        attachment = {
          content: imageData.toString('base64'),
          filename: imageFile.originalFilename,
          type: imageFile.mimetype,
          disposition: 'attachment',
        };

    }// Send email using SendGrid
      const msg = {
        to: 'wi',
        from: 'your-email@example.com',
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

      await sendgrid.send(msg as MailDataRequired);
      return res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email' });
    }
  });
};
