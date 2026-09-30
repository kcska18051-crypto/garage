import { spawn } from 'node:child_process'

const url = 'http://127.0.0.1:43991'
const canReach = async () => { try { return (await fetch(url)).ok } catch { return false } }
let server

if (!(await canReach())) {
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '43991'], { stdio: 'ignore', windowsHide: true })
  for (let attempt = 0; attempt < 50 && !(await canReach()); attempt += 1) await new Promise((resolve) => setTimeout(resolve, 100))
  if (!(await canReach())) { server.kill(); throw new Error('Vite server did not start') }
}

const runner = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)], { stdio: 'inherit', windowsHide: true })
const exitCode = await new Promise((resolve) => runner.on('exit', (code) => resolve(code ?? 1)))
if (server) server.kill()
process.exit(exitCode)
