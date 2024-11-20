import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
const sender= process.env.SENDER_EMAIL 
const reciever= process.env.RECIEVER_EMAIL 

export async function POST(request: Request) {
  
  try {
    const data = await request.json()

    const {name,
      email,
      address,
      phone,
      service,
      serviceType,
      description,
      serviceLocation,
      date,
      time}=data

    console.log('Received data:', data)

    const msg = {
      to: reciever!,
      from: sender!,
      subject: `New appointment request for: ${service}`,
      text: `Name: ${name }\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nSerive: ${service}\nService Type: ${serviceType}\nLocation: ${serviceLocation}\nDescription: ${description}\nDate: ${data}\nTime:${time}`,
      html: `
        <strong>Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
         <strong>Phone:</strong> ${phone}<br>
        <strong>Address:</strong> ${address}<br>
        <strong>Service:</strong> ${service}<br>
        <strong>Type:</strong> ${serviceType}<br>
        <strong>Description:</strong> ${description}<br>
        <strong>Date:</strong> ${date}<br>
        <strong>Location:</strong> ${serviceLocation}<br>
        <strong>Time:</strong> ${time}<br>
      `,
    }

    await sgMail.send(msg)
    return NextResponse.json({ message: 'Thank you for your message. We will be in touch soon!' })
  } catch (error) {
    console.error('Error in schedule API:', error)
    return NextResponse.json({ message: 'There was an error processing your request. Please try again later.' }, { status: 500 })
  }
}