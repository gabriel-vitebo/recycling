import { z } from 'zod'

const envSchema = z.object({
  REACT_APP_API_URL: z.string().url()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data