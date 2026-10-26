"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAgisOrigin } from "@/lib/agis/routes";

import { createClient } from "@/lib/agis/supabase/server";
import { isLocale, type Locale } from "@/lib/agis/i18n";

export type AuthState = { error?: string; message?: string };

const message = (locale: Locale, tr: string, en: string) => locale === "en" ? en : tr;

function credentialsSchema(locale: Locale) {
  return z.object({
    email: z.email(message(locale, "Geçerli bir e-posta adresi girin.", "Enter a valid email address.")),
    password: z.string().min(6, message(locale, "Şifre en az 6 karakter olmalı.", "Password must contain at least 6 characters.")),
  });
}

function value(formData: FormData, name: string) {
  const entry = formData.get(name);
  return typeof entry === "string" ? entry.trim() : "";
}

function formLocale(formData: FormData): Locale {
  const locale = value(formData, "locale");
  return isLocale(locale) ? locale : "tr";
}

function authError(errorMessage: string, locale: Locale) {
  const lower = errorMessage.toLocaleLowerCase("tr-TR");
  if (lower.includes("invalid login credentials")) {
    return message(locale, "E-posta veya şifre hatalı.", "Email or password is incorrect.");
  }
  if (lower.includes("email not confirmed")) {
    return message(locale, "Supabase e-posta doğrulaması hâlâ açık. Yönetici Confirm email ayarını kapatmalıdır.", "Supabase email confirmation is still enabled. The administrator must disable the Confirm email setting.");
  }
  if (lower.includes("user already registered")) {
    return message(locale, "Bu e-posta adresiyle daha önce hesap oluşturulmuş.", "An account already exists for this email address.");
  }
  return message(locale, `İşlem tamamlanamadı: ${errorMessage}`, `Could not complete the operation: ${errorMessage}`);
}

export async function signIn(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = formLocale(formData);
  const parsed = credentialsSchema(locale).safeParse({
    email: value(formData, "email"),
    password: value(formData, "password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: authError(error.message, locale) };
  redirect("/");
}


export async function signUp(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = formLocale(formData);

  const parsed = credentialsSchema(locale).safeParse({
    email: value(formData, "email"),
    password: value(formData, "password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const callbackUrl = new URL(
    "/auth/callback",
    await getAgisOrigin(),
  );

  callbackUrl.searchParams.set("next", "/");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    return { error: authError(error.message, locale) };
  }

  // Hesap oluşturulurken oturum açılmışsa AGIS'e git.
  if (data.session) {
    redirect("/");
  }

  // E-posta doğrulaması gereken hesaplar için.
  return {
    message: message(
      locale,
      "Hesap oluşturma isteği alındı. E-posta doğrulaması gerekiyorsa gelen kutunuzu kontrol edin.",
      "Sign-up request received. Check your inbox if email confirmation is required.",
    ),
  };
}



export async function requestPasswordReset(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = formLocale(formData);

  const email = z.email(
    message(
      locale,
      "Geçerli bir e-posta adresi girin.",
      "Enter a valid email address.",
    ),
  ).safeParse(value(formData, "email"));

  if (!email.success) {
    return { error: email.error.issues[0]?.message };
  }

  const callbackUrl = new URL(
    "/auth/callback",
    await getAgisOrigin(),
  );

  callbackUrl.searchParams.set(
    "next",
    "/sifre-yenile",
  );

  const supabase = await createClient();

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      email.data,
      {
        redirectTo: callbackUrl.toString(),
      },
    );

  if (error) {
    return { error: authError(error.message, locale) };
  }

  return {
    message: message(
      locale,
      "Şifre sıfırlama isteği alındı. E-posta adresinizi kontrol edin.",
      "Password reset request received. Check your email.",
    ),
  };
}


export async function updatePassword(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = formLocale(formData);
  const password = z
    .string()
    .min(6, message(locale, "Şifre en az 6 karakter olmalı.", "Password must contain at least 6 characters."))
    .safeParse(value(formData, "password"));
  if (!password.success) return { error: password.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) return { error: authError(error.message, locale) };
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/giris");
}
