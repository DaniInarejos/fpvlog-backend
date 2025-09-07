import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { logger } from './logger'

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  fromEmail?: string
  fromName?: string
}

export interface EmailResult {
  success: boolean
  error?: string
}

/**
 * Generic function to send emails using MailerSend
 * @param options Email configuration options
 * @returns Promise with result indicating success or failure
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const {
    to,
    subject,
    html,
    text,
    fromEmail = process.env.MAILERSEND_FROM_EMAIL || 'noreply@skysphere.app',
    fromName = 'SkySphere'
  } = options

  try {
    // Validate required environment variable
    if (!process.env.MAILERSEND_API_KEY) {
      throw new Error('MAILERSEND_API_KEY environment variable is not configured')
    }

    // Development mode: simulate email sending for unverified domains
    const isDevelopment = process.env.NODE_ENV !== 'production'
    
    if (isDevelopment) {
      logger.info('Development mode: Simulating email send', {
        to,
        subject,
        fromEmail,
        fromName,
        html: html.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      })
      
      // Simulate successful email sending in development
      return { success: true }
    }

    // Log configuration for debugging
    logger.info('Attempting to send email', {
      to,
      subject,
      fromEmail,
      fromName,
      hasApiKey: !!process.env.MAILERSEND_API_KEY,
      apiKeyLength: process.env.MAILERSEND_API_KEY?.length || 0
    })

    const sentFrom = new Sender(fromEmail, fromName)
    const recipients = [new Recipient(to, 'Usuario')]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html)
      .setText(text || '')

    const response = await mailerSend.email.send(emailParams)
    
    logger.info('MailerSend response', {
      response: typeof response === 'object' ? JSON.stringify(response) : response
    })
    
    logger.info('Email sent successfully', {
      to,
      subject,
      fromEmail,
      timestamp: new Date().toISOString()
    })

    return { success: true }
  } catch (error) {
    let errorMessage = 'Unknown error'
    let errorDetails = {}
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = {
        name: error.name,
        stack: error.stack,
        cause: error.cause
      }
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error)
      errorDetails = error
    } else {
      errorMessage = String(error)
    }
    
    logger.error('Failed to send email', {
      to,
      subject,
      error: errorMessage,
      errorDetails,
      apiKeyConfigured: !!process.env.MAILERSEND_API_KEY,
      timestamp: new Date().toISOString()
    })

    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * Send welcome email to new users
 * @param userEmail User's email address
 * @param username User's username
 * @returns Promise with email result
 */
export async function sendWelcomeEmail(
  userEmail: string,
  username: string
): Promise<EmailResult> {
  const subject = '🎉 Bienvenido a SkySphere'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; text-align: center;">¡Hola ${username}!</h1>
      <p style="font-size: 16px; line-height: 1.6;">Gracias por unirte a <strong>SkySphere</strong>.</p>
      <p style="font-size: 16px; line-height: 1.6;">Aquí podrás compartir tus vuelos, descubrir componentes y formar parte de la comunidad FPV.</p>
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 18px; color: #2563eb;">🚀 ¡Nos vemos en el aire!</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        Este email fue enviado desde SkySphere. Si no te registraste en nuestra plataforma, puedes ignorar este mensaje.
      </p>
    </div>
  `
  const text = `¡Hola ${username}! Gracias por unirte a SkySphere. Aquí podrás compartir tus vuelos, descubrir componentes y formar parte de la comunidad FPV. ¡Nos vemos en el aire!`

  return sendEmail({
    to: userEmail,
    subject,
    html,
    text,
    fromEmail: 'no-reply@skysphere.app',
    fromName: 'SkySphere'
  })
}

/**
 * Send password reset email to users
 * @param userEmail User's email address
 * @param username User's username
 * @param resetToken Reset token for password change
 * @returns Promise with email result
 */
export async function sendPasswordResetEmail(
  userEmail: string,
  username: string,
  resetToken: string
): Promise<EmailResult> {
  const subject = '🔒 Recuperación de contraseña - SkySphere'
  const resetUrl = `https://skysphere.app/restore-password?token=${resetToken}`
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #dc2626; text-align: center;">Recuperación de contraseña</h1>
      <p style="font-size: 16px; line-height: 1.6;">Hola <strong>${username}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.6;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>SkySphere</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Restablecer contraseña</a>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:</p>
      <p style="font-size: 14px; word-break: break-all; color: #2563eb;">${resetUrl}</p>
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0;">
        <p style="font-size: 14px; margin: 0; color: #92400e;"><strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas por seguridad.</p>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña no será modificada.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        Este email fue enviado desde SkySphere. Por tu seguridad, nunca compartas este enlace con nadie.
      </p>
    </div>
  `
  
  const text = `Hola ${username}, hemos recibido una solicitud para restablecer tu contraseña en SkySphere. Visita este enlace para continuar: ${resetUrl} (Expira en 24 horas). Si no solicitaste este cambio, ignora este email.`

  return sendEmail({
    to: userEmail,
    subject,
    html,
    text,
    fromEmail: 'no-reply@skysphere.app',
    fromName: 'SkySphere'
  })
}