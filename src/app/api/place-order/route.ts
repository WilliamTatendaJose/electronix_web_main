import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function POST(request: Request) {
  const data = await request.json()
  const { customer, items, total, orderDate } = data

  const itemsList = items.map(
    (item: { name: unknown; quantity: unknown; refurbishedPrice: unknown }) => `<li>${item.name} - Quantity: ${item.quantity} - Price: $${item.refurbishedPrice}</li>`
  ).join('');

  const msg = {
    to: 'williamtjose@outlook.com', // Change this to your recipient
    from: 'josewirri@hotmail.com', // Change this to your verified sender
    subject: `New order placed from ${customer.name}`,
    text: `Name: ${customer.name}\nEmail: ${customer.email}\nphone: ${customer.phone}`,
    html: `
    <h3>Order Summary:</h3>
    <ul>${itemsList}</ul>
      <p><strong>Total Price:</strong> ${total}</p>
      <p><strong>Order Date:</strong>${orderDate}</p>
      <h3>Customer Information:</h3>
      <p>${customer.address}</p>
      <strong>Name:</strong> ${customer.name}<br>
      <strong>Email:</strong> ${customer.email}<br>
      <strong>phone:</strong> ${customer.phone}<br>
      <strong>Address:</strong>${customer.address}<br>
      <strong>PaymentMethod:</strong>${customer.paymentMethod}
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