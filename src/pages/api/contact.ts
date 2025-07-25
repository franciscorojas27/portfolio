import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import { EMAIL } from "astro:env/client";
import {
  getSecret,
  LIMIT_WINDOW_MS,
  MAX_REQUESTS_PER_WINDOW,
} from "astro:env/server";
import { z } from "zod";

export const prerender = false;

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  message: z.string().min(1, "El mensaje es requerido"),
});

const rateLimitMap = new Map<
  string,
  { count: number; firstRequestTs: number }
>();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: getSecret("EMAIL_API"),
    pass: getSecret("GMAIL_PASS"),
  },
});

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, firstRequestTs: now });
    return false;
  }

  if (now - entry.firstRequestTs > LIMIT_WINDOW_MS) {
    // Reiniciar ventana
    rateLimitMap.set(ip, { count: 1, firstRequestTs: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  console.log(`RateLimit: actualmente ${rateLimitMap.size} IPs registradas.`);
  rateLimitMap.set(ip, {
    count: entry.count + 1,
    firstRequestTs: entry.firstRequestTs,
  });
  return false;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? "unknown";

  if (isRateLimited(ip)) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: "/?error=ratelimit",
      },
    });
  }

  const form = await request.formData();
  const name = form.get("name")?.toString() ?? "";
  const email = form.get("email")?.toString() ?? "";
  const message = form.get("message")?.toString() ?? "";

  // Validar con Zod
  const validation = schema.safeParse({ name, email, message });
  if (!validation.success) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: "/?error=zod",
      },
    });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: getSecret("EMAIL_API"),
      subject: "Nuevo mensaje desde formulario",
      html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    console.log("Correo enviado:", { name, email, message });

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/?success=1",
      },
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/?error=1",
      },
    });
  }
};
