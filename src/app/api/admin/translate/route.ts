import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'العنوان والمحتوى مطلوبان للترجمة' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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

    // Direct REST API call without external npm dependency
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error details:', errorText);
      throw new Error(`Gemini API failed with status ${response.status}`);
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    // Clean up potential markdown formatting from the response (e.g. ```json ... ```)
    const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let translatedData;
    try {
      translatedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', cleanJson);
      throw new Error('Invalid JSON returned from model');
    }

    // Return the translated data successfully
    return NextResponse.json({ success: true, data: translatedData });

  } catch (error) {
    console.error('Translation API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'تعذرت الترجمة الآلية حالياً. يرجى التأكد من اتصالك أو المحاولة لاحقاً.' 
      },
      { status: 503 }
    );
  }
}
