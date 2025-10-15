import { env } from '~/config/environment'

//nhung domain duoc phep truy cap toi tai nguyen server
export const WHITELIST_DOMAINS = [
  'http://localhost:5173'
]

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const MAILER_SEND_TEMPLATE_IDS = {
  REGISER_ACCOUNT: '7dnvo4dz3k9l5r86'
}

export const SERVICE_NAME = '2FA - ChaoBanh'
