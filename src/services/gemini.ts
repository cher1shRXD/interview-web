import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileToBase64 } from "../utils/file-to-base64";
import type { AnalysisResult, AnalyzePortfolioRequest } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const getFeedback = async (question: string, userAnswer: string, modelAnswer: string): Promise<string> => {
  const prompt = `
당신은 엄격하고 객관적인 IT기업의 면접관입니다. 지원자의 답변을 평가해주세요.

아래 정보를 참고하여 평가하되, **피드백에 질문 내용이나 모범답안을 직접 인용하거나 반복하지 마세요.**

[면접 질문]
${question}

[모범답안의 핵심 내용]
${modelAnswer}

[지원자의 실제 답변]
${userAnswer}

**평가 기준 (엄격하게 적용):**
- **1점**: 답변 없음, 또는 질문과 완전히 무관한 답변 (예: "안녕하세요", "잘 모르겠습니다" 등)
- **2점**: 매우 피상적이거나 핵심을 전혀 다루지 못한 답변
- **3점**: 일부 관련 내용이 있지만 모범답안의 핵심을 절반 이상 놓친 답변
- **4점**: 모범답안의 주요 내용을 대부분 포함하고 있으나 일부 디테일이 부족한 답변
- **5점**: 모범답안의 모든 핵심을 정확하고 구체적으로 설명한 완벽한 답변

**중요**: 지원자의 답변이 모범답안과 얼마나 일치하는지 내용을 직접 비교하여 평가하세요. 단순한 인사말이나 관련 없는 내용에는 반드시 1-2점을 부여하세요.

다음 형식으로 피드백을 작성하세요:

## 평가: X/5점
[점수에 대한 명확한 이유를 1-2문장으로 설명]

## 잘한 점
[답변에서 긍정적인 부분을 구체적으로 2-3문장으로 설명. 만약 잘한 점이 없다면 "답변이 질문과 관련이 없어 평가할 만한 내용이 없습니다."라고 작성]

## 개선할 점
[모범답안과 비교했을 때 부족한 부분을 구체적으로 2-3문장으로 설명. 핵심 키워드나 개념을 언급하되 모범답안을 그대로 복사하지 마세요]

## 추가 조언
[실무 관점에서의 조언을 1-2문장으로 제공]

건설적이되 객관적으로 평가해주세요.
`;

  try {
    // gemini-2.0-flash-lite 사용
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting feedback:", error);
    throw new Error("피드백 생성 중 오류가 발생했습니다.");
  }
};

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
