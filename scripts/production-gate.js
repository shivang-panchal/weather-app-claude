/**
 * Production Gate — checks Jira before every deploy to main.
 *
 * Rules:
 *   - Queries all bugs labelled "auto-detected" in the KAN project
 *   - If ANY bug is still "To Do" or "In Progress" → exit 1 (blocks CI + Netlify)
 *   - Only when ALL bugs are "Done" (fixed or skipped) → exit 0 (deploy allowed)
 *
 * Usage:
 *   npm run gate:production
 *
 * In Jira, to mark a bug as skipped:
 *   Move the ticket to "Done" — that counts as resolved (fix or skip, both are fine).
 */

import https from 'https'

const JIRA_BASE  = 'dasinfomedia-team-ek92be04.atlassian.net'
const JIRA_EMAIL = 'shivang@dasinfomedia.com'
const JIRA_TOKEN = process.env.JIRA_API_TOKEN
const PROJECT    = 'KAN'

// Statuses that block production
const OPEN_STATUSES = ['to do', 'in progress', 'open', 'reopened']

function jiraGet(path) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64')
    const options = {
      hostname: JIRA_BASE,
      path,
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    }
    const req = https.request(options, (res) => {
      let raw = ''
      res.on('data', (c) => raw += c)
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) } catch { resolve(raw) }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

async function main() {
  if (!JIRA_TOKEN) {
    console.error('❌  JIRA_API_TOKEN is not set.')
    process.exit(1)
  }

  console.log('\n🔍  Production Gate — checking Jira bug statuses...\n')

  // JQL: all bugs in this project that were auto-detected
  const jql = encodeURIComponent(
    `project = ${PROJECT} AND issuetype = Bug AND labels = "auto-detected" ORDER BY created DESC`
  )
  const data = await jiraGet(`/rest/api/3/search/jql?jql=${jql}&fields=summary,status,priority&maxResults=100`)

  if (!data.issues) {
    console.error('❌  Failed to fetch issues from Jira:', JSON.stringify(data).slice(0, 300))
    process.exit(1)
  }

  const issues = data.issues
  if (issues.length === 0) {
    console.log('✅  No auto-detected bugs found in Jira. Production deploy allowed.\n')
    process.exit(0)
  }

  // Split into open vs resolved
  const open = issues.filter(i => OPEN_STATUSES.includes(i.fields.status.name.toLowerCase()))
  const done = issues.filter(i => !OPEN_STATUSES.includes(i.fields.status.name.toLowerCase()))

  // Print summary table
  console.log(`${'Ticket'.padEnd(10)} ${'Priority'.padEnd(10)} ${'Status'.padEnd(15)} Summary`)
  console.log('─'.repeat(80))

  for (const issue of issues) {
    const key      = issue.key.padEnd(10)
    const priority = (issue.fields.priority?.name || 'Unknown').padEnd(10)
    const status   = issue.fields.status.name.padEnd(15)
    const summary  = issue.fields.summary.slice(0, 50)
    const isOpen   = OPEN_STATUSES.includes(issue.fields.status.name.toLowerCase())
    const icon     = isOpen ? '🔴' : '✅'
    console.log(`${icon}  ${key} ${priority} ${status} ${summary}`)
  }

  console.log('─'.repeat(80))
  console.log(`\n  Total bugs : ${issues.length}`)
  console.log(`  ✅ Done    : ${done.length}`)
  console.log(`  🔴 Open    : ${open.length}\n`)

  if (open.length > 0) {
    console.log('🚫  PRODUCTION BLOCKED — the following bugs are still open:\n')
    for (const issue of open) {
      const url = `https://${JIRA_BASE}/browse/${issue.key}`
      console.log(`   • ${issue.key} [${issue.fields.status.name}] — ${issue.fields.summary}`)
      console.log(`     ${url}`)
    }
    console.log('\n   👉 In Jira: move each ticket to "Done" to mark it as fixed or skipped.')
    console.log('   👉 Then re-run this gate or push again to trigger CI.\n')
    process.exit(1)
  }

  console.log('✅  All bugs resolved. Production deploy is cleared!\n')
  process.exit(0)
}

main()
