/* eslint-disable no-console */
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { env } from '~/config/environment'
import { logger } from '~/config/logger'

const mailerSendInstance = new MailerSend({ apiKey: env.MAILER_SEND_API_KEY })
const sentFrom = new Sender(env.ADMIN_SENDER_EMAIL, env.ADMIN_SENDER_NAME)

const sendEmail = async ({ to, toName, subject, templateId, personalizationData }) => {
  try {
    const recipients = [
      new Recipient(to, toName)
    ]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setTemplateId(templateId)
      .setPersonalization(personalizationData)


    const data = await mailerSendInstance.email.send(emailParams)
    return data

  } catch (error) {
    logger.error('error in mailer send provider', error)
    console.log(error)
    throw error
  }
}

export const MailerSendProvider = {
  sendEmail
}