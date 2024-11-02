import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function POST(request: Request) {
  const data = await request.json()
  const { userDetails, systemDetails} = data

  const msg = {
    to: 'williamtjose@outlook.com', // Change this to your recipient
    from: 'josewirri@hotmail.com', // Change this to your verified sender
    subject: `New Solar Quote from: ${userDetails.name}`,
    text: `Name: ${userDetails.name }\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}\nSystem Size: ${systemDetails.systemSize}\nBattery Capacity: ${systemDetails.batteryCapacity}\nBattery Voltage: ${systemDetails.batteryVoltage}\nCost: ${systemDetails.cost}\nSystem Type: ${systemDetails.systemType}\nPricing Tier: ${systemDetails.selectedTier}`,
    html: `
      <strong>Name:</strong> ${userDetails.name}<br>
      <strong>Email:</strong> ${userDetails.email}<br>
      <strong>Phone:</strong> ${userDetails.phone}<br>
      <strong>System Size:</strong> ${systemDetails.systemSize}<br>
      <strong>Battery Capacity:</strong> ${systemDetails.batteryCapacity}<br>
      <strong>Battery Voltage:</strong> ${systemDetails.batteryVoltage}<br>
      <strong>Cost:</strong> ${systemDetails.cost}<br>
      <strong>System Type:</strong> ${systemDetails.systemType}<br>
      <strong>Pricing Tier:</strong> ${systemDetails.selectedTier}<br>
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