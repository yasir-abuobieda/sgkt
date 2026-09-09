'use server'

import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  phone: z.string().min(5, "رقم الهاتف غير صحيح"),
  city: z.string().min(2, "اسم المدينة مطلوب"),
  eventId: z.string().min(1, "الفعالية مطلوبة"),
  notes: z.string().optional(),
});

export async function registerForEvent(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    // Parse but gracefully handle validation errors
    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }
    const parsed = validation.data;

    const eventName = parsed.eventId === '1' ? 'فعالية تعارف الشباب السوداني' :
      parsed.eventId === '4' ? 'مؤتمر الشباب السوداني الأول' :
        parsed.eventId;

    // Send email using Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: "a30b2cde-7342-4380-80eb-16b6da6b1c3c",
        subject: `تسجيل جديد: ${parsed.name}`,
        from_name: "موقع مجلس الشباب السوداني",
        name: parsed.name,
        email: "yasirfadlallaweb979@gmail.com",
        message: `
الاسم: ${parsed.name}
رقم الهاتف: ${parsed.phone}
المدينة: ${parsed.city}
الفعالية: ${eventName}
الملاحظات: ${parsed.notes || "لا يوجد"}
        `
      })
    });

    const responseText = await response.text();
    let responseData = { message: "حدث خطأ غير متوقع" };

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Web3Forms HTML Error:", responseText);
      if (!response.ok) {
        // Return the first 50 chars of the error to see what's actually blocking it
        throw new Error(`مشكلة فنية (Server): ${responseText.substring(0, 50)}`);
      }
    }

    if (!response.ok) {
      throw new Error(responseData.message || "حدث خطأ في خادم البريد");
    }

    return { success: true, message: 'تم التسجيل بنجاح! شكراً لك.' };
  } catch (error: any) {
    console.error("Registration Error:", error);
    return { success: false, message: error.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' };
  }
}
