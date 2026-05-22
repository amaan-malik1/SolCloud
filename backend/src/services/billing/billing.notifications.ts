import { prisma } from '../../db/client'

interface NotifPrefs { lowBalanceThreshold: number; emailAlerts: boolean }

async function getUserNotifPrefs(userId: string): Promise<NotifPrefs> {
  const row = await prisma.indexerState.findUnique({ where: { key: `notif:${userId}` } })
  const defaults: NotifPrefs = { lowBalanceThreshold: 2, emailAlerts: true }
  return row ? { ...defaults, ...JSON.parse(row.value) } : defaults
}

export async function checkAndNotifyLowBalance(userId: string, newBalanceUsd: number, userEmail: string): Promise<void> {
  const prefs = await getUserNotifPrefs(userId)
  if (!prefs.emailAlerts) return
  if (newBalanceUsd > prefs.lowBalanceThreshold) return

  console.log(`[billing-notify] LOW BALANCE — User: ${userEmail} | Balance: $${newBalanceUsd.toFixed(4)} | Threshold: $${prefs.lowBalanceThreshold}`)

  const notifKey = `low_balance_sent:${userId}:${new Date().toDateString()}`
  await prisma.indexerState.upsert({
    where: { key: notifKey },
    create: { key: notifKey, value: 'sent' },
    update: { value: 'sent' },
  }).catch(() => {})
}
