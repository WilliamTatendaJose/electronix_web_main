import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
const sender= process.env.SENDER_EMAIL 
const reciever= process.env.RECIEVER_EMAIL 

export async function POST(request: Request) {
  const data = await request.json()

   const {name, email, phone, address, selectedPackage, orderDate }=data

  const msg = {
    to: reciever!, // Change this to your recipient
    from: sender!, // Change this to your verified sender
    subject: `New Solar Order for : ${selectedPackage}`,
    text: `Name: ${name }\nEmail: ${email}\nPhone: ${phone}\nSystem Size: ${selectedPackage}`,
    html: `
      <strong>Name:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Phone:</strong> ${phone}<br>
      <strong>Address:</strong> ${address}<br>
      <strong>System Size:</strong> ${selectedPackage}<br>
      <strong>Order Date:</strong> ${orderDate}<br>
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