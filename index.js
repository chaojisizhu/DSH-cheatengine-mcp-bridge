// dsh-cheatengine-mcp-bridge — DeepSeek Harness bundle entry.
//
// Exposes the CheatEngine bridge paths as a Cordis service so the
// mcp-cheatengine row in cordis.patch.yml can reference the bundled Python MCP
// server by its installed location (`!!js ctx.ceBridgePaths.serverScript`).
// The service name must match the `inject: [ceBridgePaths]` entry in the patch.
//
// Zero external dependencies on purpose: the loader provides the cordis
// context at runtime, so this module only uses Node built-ins.
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const moduleDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = moduleDir // index.js lives at the repository root

export const name = 'ce-bridge-paths'

export function apply(ctx) {
  // Register the path service. Cordis defers the mcp-cheatengine row's
  // config evaluation (and apply) until this service is available.
  ctx.provide('ceBridgePaths', {
    /** Repository root (the directory containing MCP_Server/). */
    packageRoot,
    /** Absolute path of the Python MCP server entry point. */
    serverScript: join(packageRoot, 'MCP_Server', 'mcp_cheatengine.py'),
    /**
     * Python executable used to launch the server. Override at install time
     * with the CE_MCP_PYTHON environment variable (e.g. a venv interpreter).
     */
    pythonCommand: process.env.CE_MCP_PYTHON || 'python',
    /** Stable MCP namespace: tools surface as mcp__cheatengine__<tool>. */
    serverName: 'cheatengine',
  })
}