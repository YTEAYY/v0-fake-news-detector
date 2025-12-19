"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, ShieldAlert, Info, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { HighlightedText } from "@/components/highlighted-text"

// 분석 키워드 데이터베이스
const sensationalKeywords = [
  "충격",
  "경악",
  "긴급",
  "속보",
  "놀라운",
  "믿을 수 없는",
  "반드시",
  "절대",
  "100%",
  "확실한",
]
const exaggerationKeywords = [
  "전 세계",
  "모든",
  "절대로",
  "무조건",
  "완벽한",
  "최고의",
  "최악의",
  "엄청난",
  "대박",
  "초대형",
  "전면 금지",
]

const emotionalKeywords = ["분노", "공포", "충격", "믿을 수 없는", "경악", "놀라운"]

const sourcelessKeywords = [
  "전문가에 따르면",
  "연구 결과에 의하면",
  "보도에 따르면",
  "소식통에 의하면",
  "알려진 바에 따르면",
]

const trustKeywords = ["연구", "보고서", "통계", "전문가", "교수", "박사", "발표", "조사", "자료", "출처"]

interface AnalysisResult {
  score: number
  level: "trust" | "caution" | "suspicious"
  detectedKeywords: {
    sensational: string[]
    exaggeration: string[]
    trust: string[]
  }
  highlights: {
    exaggeration: string[]
    sourceless: string[]
    emotional: string[]
  }
  riskCount: number
  message: string
  details: string
}

export default function FakeNewsDetector() {
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showGuide, setShowGuide] = useState(true)

  const analyzeText = () => {
    if (!inputText.trim()) {
      alert("뉴스 텍스트를 입력해주세요.")
      return
    }

    setIsAnalyzing(true)

    // 분석 시뮬레이션 (실제로는 즉시 계산되지만 UX를 위해 약간의 딜레이)
    setTimeout(() => {
      const text = inputText.toLowerCase()

      // 키워드 감지
      const detectedSensational = sensationalKeywords.filter((keyword) => inputText.includes(keyword))
      const detectedExaggeration = exaggerationKeywords.filter((keyword) => inputText.includes(keyword))
      const detectedTrust = trustKeywords.filter((keyword) => inputText.includes(keyword))

      const detectedEmotional = emotionalKeywords.filter((keyword) => inputText.includes(keyword))
      const detectedSourceless = sourcelessKeywords.filter((keyword) => inputText.includes(keyword))
      const detectedExaggerationForHighlight = [
        ...new Set(
          [
            ...exaggerationKeywords.filter((keyword) => inputText.includes(keyword)),
            "무조건",
            "100%",
            "전면 금지",
            "충격적인 진실",
          ].filter((keyword) => inputText.includes(keyword)),
        ),
      ]

      // 위험 단어 개수
      const riskCount = detectedSensational.length + detectedExaggeration.length

      // 텍스트 길이에 따른 가중치
      const wordCount = inputText.trim().split(/\s+/).length
      const lengthWeight = wordCount > 50 ? 1.2 : wordCount > 20 ? 1.0 : 0.8

      // 신뢰도 점수 계산 (0-100)
      let baseScore = 70
      baseScore -= detectedSensational.length * 8
      baseScore -= detectedExaggeration.length * 6
      baseScore += detectedTrust.length * 10

      // 가중치 적용
      const finalScore = Math.max(0, Math.min(100, baseScore * lengthWeight))

      // 레벨 판정
      let level: "trust" | "caution" | "suspicious"
      let message: string
      let details: string

      if (finalScore >= 80) {
        level = "trust"
        message = "신뢰할 수 있는 뉴스입니다"
        details = "출처가 명확하고 과장 표현이 적습니다."
      } else if (finalScore >= 50) {
        level = "caution"
        message = "주의가 필요합니다"
        details = "일부 자극적인 표현이 포함되어 있습니다. 다른 출처와 교차 확인을 권장합니다."
      } else {
        level = "suspicious"
        message = "가짜 뉴스가 의심됩니다"
        details = "자극적이고 과장된 표현이 많이 포함되어 있습니다. 신뢰하기 어렵습니다."
      }

      setResult({
        score: Math.round(finalScore),
        level,
        detectedKeywords: {
          sensational: detectedSensational,
          exaggeration: detectedExaggeration,
          trust: detectedTrust,
        },
        highlights: {
          exaggeration: detectedExaggerationForHighlight,
          sourceless: detectedSourceless,
          emotional: detectedEmotional,
        },
        riskCount,
        message,
        details,
      })
      setIsAnalyzing(false)
      setShowGuide(false)
    }, 1200)
  }

  const resetAnalysis = () => {
    setInputText("")
    setResult(null)
    setShowGuide(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <ShieldAlert className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">가짜 뉴스 판별 도우미</h1>
              <p className="text-sm text-muted-foreground">AI 기반 뉴스 신뢰도 분석 시스템</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 입력 영역 */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">뉴스 텍스트 입력</h2>
                  <p className="text-sm text-muted-foreground">분석하려는 뉴스 문장이나 기사 내용을 입력하세요</p>
                </div>

                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="예: 충격! 놀라운 발견으로 전 세계가 경악했습니다..."
                  className="min-h-[200px] resize-none"
                  disabled={isAnalyzing}
                />

                <div className="flex gap-2">
                  <Button
                    onClick={analyzeText}
                    disabled={isAnalyzing || !inputText.trim()}
                    className="flex-1"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        분석 시작
                      </>
                    )}
                  </Button>

                  {result && (
                    <Button onClick={resetAnalysis} variant="outline" size="lg">
                      초기화
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* 사용 안내 */}
            {showGuide && (
              <Card className="p-6 bg-muted/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">사용 방법</h3>
                  </div>

                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p>뉴스 문장이나 기사를 입력창에 붙여넣으세요</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p>분석 시작 버튼을 클릭하면 AI가 신뢰도를 평가합니다</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p>점수와 감지된 키워드를 확인하여 뉴스를 판단하세요</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold text-sm text-foreground mb-2">신뢰도 점수 기준</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">80점 이상</span>
                        <Badge
                          variant="default"
                          className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                        >
                          신뢰 가능
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">50-79점</span>
                        <Badge
                          variant="default"
                          className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20"
                        >
                          주의 필요
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">50점 미만</span>
                        <Badge
                          variant="default"
                          className="bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20"
                        >
                          가짜 의심
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* 결과 영역 */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">의심 요소 하이라이트</h2>

                    {/* Color legend */}
                    <div className="flex flex-wrap gap-3 text-sm pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-red-200 dark:bg-red-900/40 border border-red-300 dark:border-red-800" />
                        <span className="text-muted-foreground">과장 표현</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-orange-200 dark:bg-orange-900/40 border border-orange-300 dark:border-orange-800" />
                        <span className="text-muted-foreground">출처 불명</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-yellow-200 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-800" />
                        <span className="text-muted-foreground">감정 자극</span>
                      </div>
                    </div>

                    {/* Highlighted text display */}
                    <div className="bg-muted/30 rounded-lg p-4 text-sm border border-border">
                      <HighlightedText text={inputText} highlights={result.highlights} />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      색상으로 강조된 단어는 가짜 뉴스의 특징적인 표현입니다. 이러한 표현이 많을수록 신뢰도가 낮습니다.
                    </p>
                  </div>
                </Card>

                {/* 신뢰도 점수 */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">신뢰도 점수</h2>
                      {result.level === "trust" && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {result.level === "caution" && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                      {result.level === "suspicious" && <ShieldAlert className="h-5 w-5 text-red-600" />}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <span className="text-5xl font-bold text-foreground">{result.score}</span>
                        <span className="text-2xl text-muted-foreground">/ 100</span>
                      </div>

                      <Progress
                        value={result.score}
                        className={`h-3 ${
                          result.level === "trust"
                            ? "[&>div]:bg-green-600"
                            : result.level === "caution"
                              ? "[&>div]:bg-yellow-600"
                              : "[&>div]:bg-red-600"
                        }`}
                      />
                    </div>

                    <Alert
                      className={
                        result.level === "trust"
                          ? "bg-green-500/10 border-green-500/20"
                          : result.level === "caution"
                            ? "bg-yellow-500/10 border-yellow-500/20"
                            : "bg-red-500/10 border-red-500/20"
                      }
                    >
                      <AlertDescription>
                        <p className="font-semibold text-foreground mb-1">{result.message}</p>
                        <p className="text-sm text-muted-foreground">{result.details}</p>
                      </AlertDescription>
                    </Alert>
                  </div>
                </Card>

                {/* 감지된 키워드 */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">상세 분석 결과</h2>
                      <Badge variant="outline">위험 단어 {result.riskCount}개</Badge>
                    </div>

                    <div className="space-y-4">
                      {/* 자극적 키워드 */}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          자극적 키워드
                        </h3>
                        {result.detectedKeywords.sensational.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.detectedKeywords.sensational.map((keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="default"
                                className="bg-red-500/10 text-red-700 dark:text-red-400"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">감지되지 않음</p>
                        )}
                      </div>

                      {/* 과장 표현 */}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-yellow-500" />
                          과장 표현
                        </h3>
                        {result.detectedKeywords.exaggeration.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.detectedKeywords.exaggeration.map((keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="default"
                                className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">감지되지 않음</p>
                        )}
                      </div>

                      {/* 신뢰 요소 */}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          신뢰 요소
                        </h3>
                        {result.detectedKeywords.trust.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.detectedKeywords.trust.map((keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="default"
                                className="bg-green-500/10 text-green-700 dark:text-green-400"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">감지되지 않음</p>
                        )}
                      </div>
                    </div>

                    {/* 요약 */}
                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-red-600">{result.riskCount}</p>
                          <p className="text-sm text-muted-foreground">위험 요소</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{result.detectedKeywords.trust.length}</p>
                          <p className="text-sm text-muted-foreground">신뢰 요소</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <ShieldAlert className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">분석 결과 대기 중</h3>
                    <p className="text-sm text-muted-foreground">
                      뉴스를 입력하고 분석 버튼을 누르면
                      <br />
                      신뢰도 점수와 상세 분석 결과가 표시됩니다
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            이 도구는 참고용이며, 최종 판단은 사용자의 비판적 사고가 필요합니다.
          </p>
        </div>
      </footer>
    </div>
  )
}
