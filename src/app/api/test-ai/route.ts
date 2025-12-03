import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada no .env' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Responda apenas: "API funcionando!"',
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Erro ${response.status}: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';

    return NextResponse.json({
      success: true,
      response: textResponse,
      model: 'gemini-2.0-flash',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
