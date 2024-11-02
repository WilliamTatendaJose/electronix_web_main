import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function POST(request: Request) {
  const data = await request.json()
  const { name, email, subject, message } = data

  const msg = {
    to: 'williamtjose@outlook.com', // Change this to your recipient
    from: 'josewirri@hotmail.com', // Change this to your verified sender
    subject: `New Contact Form Submission: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `
      <strong>Name:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Subject:</strong> ${subject}<br>
      <strong>Message:</strong><br>
      ${message.replace(/\n/g, '<br>')}
    `,
  }

  try {
    await sgMail.send(msg)
    return NextResponse.json({ message: 'Thank you for your message. We will be in touch soon!' })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ message: 'There was an error sending your message. Please try again later.' }, { status: 500 })
  }
}