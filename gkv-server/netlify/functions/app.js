import serverless from 'serverless-http'
import app from '../../dist/index.js' // compiled ESM app

export const handler = serverless(app)
