import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
const sender= process.env.SENDER_EMAIL 
const reciever= process.env.RECIEVER_EMAIL 

export async function POST(request: Request) {
  const data = await request.json()

   const {formData}=data

  const msg = {
    to: reciever!,
    from: sender!,
    subject: `New appointment request for: ${formData.service}`,
    text: ``,
    html: `
      <strong>Name:</strong> ${formData.name}<br>
      <strong>Email:</strong> ${formData.email}<br>
       <strong>Phone:</strong> ${formData.phone}<br>
      <strong>Address:</strong> ${formData.address}<br>
      <strong>Service:</strong> ${formData.service}<br>
      <strong>Type:</strong> ${formData.serviceType}<br>
      <strong>Description:</strong> ${formData.description}<br>
      <strong>Date:</strong> ${formData.date}<br>
      <strong>Location:</strong> ${formData.serviceLocation}<br>
      <strong>Time:</strong> ${formData.time}<br>
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