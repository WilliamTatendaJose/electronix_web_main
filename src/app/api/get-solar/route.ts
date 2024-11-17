import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function POST(request: Request) {
  const data = await request.json()
  const { customer, orderDate} = data

  const msg = {
    to: 'williamtjose@outlook.com', // Change this to your recipient
    from: 'josewirri@hotmail.com', // Change this to your verified sender
    subject: `New Solar Order for : ${customer.packageName}`,
    text: `Name: ${customer.name }\nEmail: ${customer.email}\nPhone: ${customer.phone}\nSystem Size: ${customer.packageName}`,
    html: `
      <strong>Name:</strong> ${customer.name}<br>
      <strong>Email:</strong> ${customer.email}<br>
      <strong>Phone:</strong> ${customer.phone}<br>
      <strong>System Size:</strong> ${customer.packageName}<br>
      <strong>System Size:</strong> ${orderDate}<br>
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