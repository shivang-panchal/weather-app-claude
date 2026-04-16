import { execSync } from 'child_process'
import https from 'https'

// ─── Jira Config ────────────────────────────────────────────────────────────
const JIRA_BASE = 'https://dasinfomedia-team-ek92be04.atlassian.net'
const JIRA_EMAIL = 'shivang@dasinfomedia.com'
const JIRA_TOKEN = process.env.JIRA_API_TOKEN
const JIRA_PROJECT = 'KAN'

// ─── Helpers ────────────────────────────────────────────────────────────────
function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', cwd: process.cwd() })
  } catch (e) {
    return e.stdout || e.message || ''
  }
}

function jiraRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64')
    const data = body ? JSON.stringify(body) : null
    const options = {
      hostname: 'dasinfomedia-team-ek92be04.atlassian.net',
      path,
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
      },
    }
    const req = https.request(options, (res) => {
      let raw = ''
      res.on('data', (chunk) => raw += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) } catch { resolve(raw) }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

async function createJiraBug({ summary, description, priority }) {
  const result = await jiraRequest('POST', '/rest/api/3/issue', {
    fields: {
      project: { key: JIRA_PROJECT },
      issuetype: { name: 'Bug' },
      summary,
      priority: { name: priority },
      labels: ['auto-detected'],
      description: {
        type: 'doc',
        version: 1,
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: description }],
        }],
      },
    },
  })
  return result
}

// ─── Scanners ────────────────────────────────────────────────────────────────
function scanEslint() {
  console.log('🔍 Running ESLint...')
  const output = run('npx eslint . --format json 2>/dev/null || npx eslint . --format json')
  const bugs = []
  try {
    const results = JSON.parse(output)
    for (const file of results) {
      for (const msg of file.messages) {
        const severity = msg.severity === 2 ? 'High' : 'Medium'
        const shortFile = file.filePath.replace(process.cwd(), '')
        bugs.push({
          source: 'ESLint',
          priority: severity === 'High' ? 'High' : 'Medium',
          summary: `[ESLint] ${msg.message}`,
          description: `Rule: ${msg.ruleId || 'unknown'}\nFile: ${shortFile}\nLine: ${msg.line}, Column: ${msg.column}\nSeverity: ${severity}`,
        })
      }
    }
  } catch {
    // no lint errors or parse error
  }
  console.log(`   Found ${bugs.length} ESLint issue(s)`)
  return bugs
}

function scanNpmAudit() {
  console.log('🔍 Running npm audit...')
  const output = run('npm audit --json')
  const bugs = []
  try {
    const result = JSON.parse(output)
    const vulns = result.vulnerabilities || {}
    for (const [name, vuln] of Object.entries(vulns)) {
      const severityMap = { critical: 'Critical', high: 'High', moderate: 'Medium', low: 'Low' }
      const priority = severityMap[vuln.severity] || 'Medium'
      bugs.push({
        source: 'npm audit',
        priority,
        summary: `[Security] Vulnerable package: ${name}`,
        description: `Package: ${name}\nSeverity: ${vuln.severity}\nVia: ${vuln.via?.map(v => typeof v === 'string' ? v : v.title).join(', ')}\nFix: ${vuln.fixAvailable ? 'Available' : 'Not available'}`,
      })
    }
  } catch {
    // no vulnerabilities
  }
  console.log(`   Found ${bugs.length} security issue(s)`)
  return bugs
}

function scanTests() {
  console.log('🔍 Running unit tests...')
  const output = run('npx vitest run --reporter=json 2>&1 || true')
  const bugs = []
  try {
    const jsonMatch = output.match(/\{[\s\S]*"testResults"[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      for (const suite of result.testResults || []) {
        for (const test of suite.assertionResults || []) {
          if (test.status === 'failed') {
            bugs.push({
              source: 'Unit Test',
              priority: 'High',
              summary: `[Test Failed] ${test.fullName}`,
              description: `Test: ${test.fullName}\nFile: ${suite.testFilePath?.replace(process.cwd(), '')}\nError: ${test.failureMessages?.join('\n') || 'Unknown error'}`,
            })
          }
        }
      }
    }
  } catch {
    // parse error
  }
  console.log(`   Found ${bugs.length} failing test(s)`)
  return bugs
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  if (!JIRA_TOKEN) {
    console.error('❌ JIRA_API_TOKEN environment variable is not set.')
    console.error('   Run: $env:JIRA_API_TOKEN="your_token" (PowerShell) or export JIRA_API_TOKEN="your_token" (bash)')
    process.exit(1)
  }

  console.log('\n🚀 Weather App — Bug Scanner\n')

  const allBugs = [
    ...scanEslint(),
    ...scanNpmAudit(),
    ...scanTests(),
  ]

  if (allBugs.length === 0) {
    console.log('\n✅ No bugs found! Your app is clean.')
    return
  }

  console.log(`\n📋 Found ${allBugs.length} issue(s) total. Creating Jira tickets...\n`)

  let created = 0
  for (const bug of allBugs) {
    const result = await createJiraBug(bug)
    if (result.key) {
      console.log(`  ✅ ${result.key} — [${bug.priority}] ${bug.summary}`)
      created++
    } else {
      console.log(`  ❌ Failed to create: ${bug.summary}`)
      console.log(`     Response:`, JSON.stringify(result).slice(0, 200))
    }
  }

  console.log(`\n🎯 Done! ${created}/${allBugs.length} tickets created in Jira project ${JIRA_PROJECT}.`)
  console.log(`\n👉 Review at: ${JIRA_BASE}/jira/software/projects/${JIRA_PROJECT}/boards/1`)
  console.log('   Move a ticket to "In Progress" to approve it for fixing.\n')
}

main()
