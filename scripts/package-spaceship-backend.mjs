import { cp, mkdir, rm, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const buildRoot = join(projectRoot, "dist", "spaceship-reservas-backend")

await rm(buildRoot, { recursive: true, force: true })
await mkdir(join(buildRoot, "backend"), { recursive: true })
await mkdir(join(buildRoot, "public", "brand"), { recursive: true })

await Promise.all([
  cp(join(projectRoot, "backend", "server.mjs"), join(buildRoot, "backend", "server.mjs")),
  cp(
    join(projectRoot, "backend", "confirmation-email.mjs"),
    join(buildRoot, "backend", "confirmation-email.mjs"),
  ),
  cp(
    join(projectRoot, "public", "brand", "eslatin-logo-horizontal.png"),
    join(buildRoot, "public", "brand", "eslatin-logo-horizontal.png"),
  ),
  cp(join(projectRoot, "backend", "SPACESHIP-DEPLOY.md"), join(buildRoot, "README.md")),
  cp(join(projectRoot, "backend", "spaceship.env.example"), join(buildRoot, "spaceship.env.example")),
])

const packageJson = await import(join(projectRoot, "backend", "package.spaceship.json"), {
  with: { type: "json" },
})
await writeFile(
  join(buildRoot, "package.json"),
  `${JSON.stringify(packageJson.default, null, 2)}\n`,
  "utf8",
)

console.log(buildRoot)
