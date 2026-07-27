import type { GenerationResult, GenerationFormValues } from '../types'

export function buildEmailHtml(result: GenerationResult, _values: GenerationFormValues): string {
  return `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2c3e50;">Your Content is Ready! 🎉</h1>

  <p>Hi there, here's your generated image, full report, and content:</p>

  <hr style="border: none; border-top: 2px solid #ecf0f1; margin: 20px 0;" />

  <h2 style="color: #3498db; font-size: 18px;">🖼️ Your Generated Image</h2>
  <p>Your image is attached to this email.</p>

  <h2 style="color: #3498db; font-size: 18px;">📄 Full Report</h2>
  <p><a href="${result.reportUrl}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Open Full Report →</a></p>

  <hr style="border: none; border-top: 2px solid #ecf0f1; margin: 20px 0;" />

  <h2 style="color: #3498db; font-size: 18px;">💼 LinkedIn Post</h2>
  <p style="white-space: pre-wrap; background:#f8f9fa; padding:15px; border-radius:8px;">${result.linkedinPost}</p>

  <h2 style="color: #3498db; font-size: 18px;">🐦 X Post</h2>
  <p style="white-space: pre-wrap; background:#f8f9fa; padding:15px; border-radius:8px;">${result.xPost}</p>

  <h2 style="color: #3498db; font-size: 18px;">📘 Facebook Post</h2>
  <p style="white-space: pre-wrap; background:#f8f9fa; padding:15px; border-radius:8px;">${result.facebookPost}</p>

  <h2 style="color: #3498db; font-size: 18px;">📝 Blog Post</h2>
  <p style="white-space: pre-wrap; background:#f8f9fa; padding:15px; border-radius:8px;">${result.blogPost}</p>
</div>`
}

export function buildEmailSubject(): string {
  return 'Your Content Strategy Guide is Ready! 📧'
}
