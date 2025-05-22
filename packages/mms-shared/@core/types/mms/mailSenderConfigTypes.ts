export type MailSenderConfigTypes = {
  id: number
  domain: string
  host: string
  port: string
  username: string
  smtpAuth: string
  password: string
  transportProtocol: string
  smtpStarttlsEnable: boolean
  smtpStarttlsRequired: boolean
  debug: boolean
}

export type MailSenderConfigData = {
  id?: number
  domain?: string
  host?: string
  port?: string
  username?: string
  smtpAuth?: string
  password?: string
  transportProtocol?: string
  smtpStarttlsEnable?: boolean
  smtpStarttlsRequired?: boolean
  debug?: boolean
}
