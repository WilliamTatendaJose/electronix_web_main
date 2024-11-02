'use server'

export async function calculateSolarSystem(dailyConsumption: number, gridType: 'off-grid' | 'on-grid') {
  // Factor in system losses (inverter efficiency, wire losses, etc.)
  const systemLosses = 1.2 // 20% losses
  const adjustedConsumption = dailyConsumption * systemLosses

  // Calculate inverter size
  // For simplicity, we'll assume peak consumption is 1.5 times the average
  const peakConsumption = adjustedConsumption * 1.5
  const inverterSize = Math.ceil(peakConsumption)

  // Calculate battery size
  let batterySize: number

  if (gridType === 'off-grid') {
    // For off-grid, size battery for 2 days of autonomy
    batterySize = Math.ceil(adjustedConsumption * 2)
  } else {
    // For on-grid, size battery for 4 hours of backup
    batterySize = Math.ceil(adjustedConsumption / 6) // Assuming 6 peak sun hours per day
  }

  // Round up to nearest whole number for simplicity
  return {
    inverterSize: Math.ceil(inverterSize),
    batterySize: Math.ceil(batterySize)
  }
}