import path from 'node:path'

import { createServer } from '@redwoodjs/api-server'
import fastifyStatic from '@fastify/static'

import { logger } from 'src/lib/logger'

async function main() {
  const server = await createServer({
    logger,
  })

  server.register(fastifyStatic, {
    root: path.join(process.cwd() + '/uploads/recipe-images'),
    prefix: '/recipe-photos',
  })

  await server.start()
}

main()
