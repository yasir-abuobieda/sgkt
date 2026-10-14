import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client.
// Make sure to add GEMINI_API_KEY to your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'العنوان والمحتوى مطلوبان للترجمة' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json(
        { success: false, error: 'مفتاح API الخاص بجوجل (GEMINI_API_KEY) غير موجود في الإعدادات' },
        { status: 500 }
      );
    }

    // Strict prompt to ensure JSON output and preservation of tone/HTML
    const prompt = `
      أنت مترجم محترف تعمل لدى "مجلس الشباب السوداني" (مؤسسة رسمية).
      قم بترجمة هذا المحتوى من اللغة العربية إلى اللغتين الإنجليزية (en) والتركية (tr).
      
      شروط هامة جداً:
      1. حافظ على أي تنسيقات HTML موجودة في النص الأصلي (مثل <strong>, <p>, <a>).
      2. حافظ على النبرة الرسمية والاحترافية.
      3. أعد النتيجة بصيغة JSON فقط بهذا الهيكل الدقيق وبدون أي نصوص إضافية حولها:
      {
        "en": {
          "title": "...",
          "content": "..."
        },
        "tr": {
          "title": "...",
          "content": "..."
        }
      }

      المحتوى المراد ترجمته:
      العنوان: ${title}
      المحتوى: ${content}
    `;

    // Using gemini-1.5-flash as it's fast, cost-effective, and great for translation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting from the response (e.g. ```json ... ```)
    const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let translatedData;
    try {
      translatedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse LLM response as JSON:", cleanJson);
      throw new Error("Invalid JSON returned from model");
    }

    // Return the translated data successfully
    return NextResponse.json({ success: true, data: translatedData });

  } catch (error) {
    console.error("Translation API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'تعذرت الترجمة الآلية حالياً. يرجى التأكد من اتصالك أو المحاولة لاحقاً.' 
      },
      { status: 503 }
    );
  }
}
