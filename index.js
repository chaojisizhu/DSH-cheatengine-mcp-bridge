// dsh-cheatengine-mcp-bridge — DeepSeek Harness bundle entry.
//
// Exposes the CheatEngine bridge paths as a Cordis service so the
// mcp-client row in cordis.patch.yml can reference the bundled Python MCP
// server by its installed location (`!!js ctx.ceBridgePaths.serverScript`).
// The service name must match the `inject: [ceBridgePaths]` in the patch.
import { Service } from '@deepseek-ai/cordis'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const moduleDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(moduleDir, '..')

export default class CeBridgePaths extends Service {
  constructor(ctx) {
    super(ctx, 'ceBridgePaths')

    /** Repository root (the directory containing MCP_Server/). */
    this.packageRoot = packageRoot
    /** Absolute path of the Python MCP server entry point. */
    this.serverScript = join(packageRoot, 'MCP_Server', 'mcp_cheatengine.py')
    /**
     * Python executable used to launch the server. Override at install time
     * with the CE_MCP_PYTHON environment variable (e.g. a venv interpreter).
     */
    this.pythonCommand = process.env.CE_MCP_PYTHON || 'python'
    /** Stable MCP namespace: tools surface as mcp__cheatengine__<tool>. */
    this.serverName = 'cheatengine'
  }
}
