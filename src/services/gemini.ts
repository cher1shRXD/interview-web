import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileToBase64 } from "../utils/file-to-base64";
import type { AnalysisResult, AnalyzePortfolioRequest } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzePortfolio = async ({
  file,
  additionalRequirements,
}: AnalyzePortfolioRequest): Promise<AnalysisResult> => {
  try {
    const base64Data = await fileToBase64(file);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const basePrompt = `
당신은 IT기업의 면접관입니다. 첨부된 PDF를 분석해주세요.

**1단계: 포트폴리오 검증**
먼저 이 PDF가 포트폴리오인지 확인해주세요. 포트폴리오는 다음 중 하나 이상을 포함해야 합니다:
- 개인 또는 팀 프로젝트 설명
- 기술 스택 또는 사용한 기술 목록
- 경력 사항 또는 경험
- 작업물, 결과물, 성과
- 개발/디자인/창작 관련 내용

만약 이 PDF가 포트폴리오가 **아니라면**, 다음과 같이 응답해주세요:
{
  "isPortfolio": false,
  "error": "NOT_PORTFOLIO"
}

**2단계: 면접 질문 생성**
PDF가 포트폴리오라면, 다음 형식의 JSON으로 응답해주세요:
{
  "isPortfolio": true,
  "summary": "포트폴리오에 대한 간단한 요약 (2-3문장)",
  "questions": [
    {
      "id": 1,
      "question": "질문 내용",
      "category": "기술/경험/프로젝트/협업 등",
      "difficulty": "easy/medium/hard",
      "relatedPage": 1,
      "answer": "이 질문에 대한 모범답안 (3-5문장, 포트폴리오 내용을 기반으로 작성)"
    }
  ]
}

요구사항:
- 최소 10개 이상의 질문을 생성해주세요
- 질문은 구체적이고 실무 중심이어야 합니다
- 포트폴리오에 명시된 기술 스택과 프로젝트 경험을 기반으로 질문을 작성하세요
- 난이도는 골고루 분포시켜주세요
- **중요**: 각 질문마다 관련된 PDF 페이지 번호를 "relatedPage" 필드에 반드시 포함해주세요
- relatedPage는 해당 질문과 가장 관련이 깊은 포트폴리오 페이지 번호입니다 (1부터 시작)
- PDF의 각 페이지를 꼼꼼히 분석하여 질문과 가장 관련있는 페이지 번호를 정확하게 지정해주세요
- **중요**: 각 질문마다 포트폴리오 내용을 기반으로 한 모범답안을 "answer" 필드에 작성해주세요
- 모범답안은 포트폴리오에 기재된 실제 경험과 기술을 바탕으로 구체적으로 작성해주세요
- 모범답안은 3-5문장 정도의 명확하고 간결한 답변이어야 합니다
${additionalRequirements ? `\n추가 요구사항: ${additionalRequirements}` : ""}

반드시 유효한 JSON 형식으로만 응답해주세요.
`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data,
        },
      },
      { text: basePrompt },
    ]);

    const response = result.response;
    const text = response.text();

    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(jsonText);

    if (parsed.isPortfolio === false || parsed.error === "NOT_PORTFOLIO") {
      throw new Error("올바른 포트폴리오를 첨부해주세요");
    }

    if (parsed.isPortfolio === true) {
      const { ...analysisResult } = parsed;
      return analysisResult as AnalysisResult;
    }

    const analysisResult: AnalysisResult = parsed;
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing portfolio:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "포트폴리오 분석 중 오류가 발생했습니다."
    );
  }
};
