import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { QuizData } from "@/types";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const ai = new GoogleGenAI({
      apiKey: "AIzaSyDG7mf1Rb99jJD0Lu4Eb0fn3JqiWC27hEs",
    });

    const words = data.word.join(",");
    const prompt = `
            請生成關於以下英文單字："${words}"（可能有多個單字，就生成多個題目）的填空題, please generate the following in English:
            1. A multiple-choice question that tests the understanding of this word in a sentence. The options should be labeled A, B, C, D.
            2. The correct letter answer for the question (e.g., "A").
            3. A detailed explanation of why the answer is correct, what the word means, and why the other options are incorrect.

            Please provide the output strictly in a JSON format with the following keys: "question", "answer", "explanation".
            Example response for the word "apple":
            {
                "question": "The a_____e on the tree looks beautiful! \\n(A) apple\\n(B) allowance\\n(C) attitude\\n(D) agriculture",
                "answer": "A",
                "explanation": "題目是說有一個在樹上的東西看起來非常漂亮，(A)表蘋果比較符合此題意思。(B)是指社會津貼 (C) 態度是對待某事的態度，與句意不符。(D) 表農業，與「在樹上的東西」的描述不符。"
            }
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let jsonStr = (response.text as string).trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    const parsedData = JSON.parse(jsonStr) as QuizData;

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: "Failed to process AI response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
