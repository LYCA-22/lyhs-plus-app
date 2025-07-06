"use client";

import { useAppDispatch } from "@/store/hook";
import { updateSystemData } from "@/store/systemSlice";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QuizData {
  question: string;
  answer: string;
  explanation: string;
}

export default function LearnPage() {
  const dispatch = useAppDispatch();

  // 狀態管理
  const [quizList, setQuizList] = useState<QuizData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [words, setWords] = useState<string[]>([]);
  const [customWord, setCustomWord] = useState<string>("");
  const [isSetupMode, setIsSetupMode] = useState<boolean>(true);

  useEffect(() => {
    dispatch(
      updateSystemData({
        isBack: true,
        BackLink: "/",
      }),
    );
  }, [dispatch]);

  const fetchQuizzes = async (wordList: string[]) => {
    dispatch(
      updateSystemData({
        isLoading: true,
      }),
    );
    const newQuizzes: QuizData[] = [];

    try {
      for (const word of wordList) {
        const response = await fetch("/api/v1/getQues", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ word: [word] }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch quiz for ${word}`);
        }

        const data: QuizData = await response.json();
        newQuizzes.push(data);
      }

      setQuizList(newQuizzes);
      setCurrentIndex(0);
      setSelectedAnswer("");
      setShowResult(false);
      setIsSetupMode(false);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      alert("無法載入題目，請稍後再試");
    } finally {
      dispatch(
        updateSystemData({
          isLoading: false,
        }),
      );
    }
  };

  const handleStartQuiz = () => {
    if (words.length === 0) {
      alert("請至少添加一個測驗單字");
      return;
    }
    fetchQuizzes(words);
  };

  const handleAnswerSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !quizList[currentIndex]) return;

    const correct = selectedAnswer === quizList[currentIndex].answer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer("");
      setShowResult(false);
    }
  };

  const handleAddWord = () => {
    if (customWord.trim()) {
      setWords([...words, customWord.trim()]);
      setCustomWord("");
    }
  };

  const handleRemoveWord = (index: number) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleBackToSetup = () => {
    setIsSetupMode(true);
    setQuizList([]);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
  };

  const parseQuestion = (question: string) => {
    const parts = question.split("\n");
    const questionText = parts[0];
    const options = parts
      .slice(1)
      .filter((part) => part.trim().startsWith("("));

    return { questionText, options };
  };

  const currentQuiz = quizList[currentIndex];

  return (
    <div className="relative w-full">
      {/* 標題區域 */}
      <div className={`flex px-5 justify-between items-center`}>
        <h1 className="text-2xl font-medium">英文單字測驗</h1>
        {!isSetupMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToSetup}
            className="text-zinc-500"
          >
            <RotateCcw size={16} />
            重新設定
          </Button>
        )}
      </div>

      {/* 設定模式 */}
      {isSetupMode ? (
        <div className="p-5 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">測驗單字</h3>

            {/* 當前單字 */}
            <div className="flex flex-wrap gap-2">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-inputPrimary text-white rounded-full text-sm font-medium"
                >
                  {word}
                  <button
                    onClick={() => handleRemoveWord(index)}
                    className="text-white/80 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {words.length === 0 && (
                <p className="text-zinc-500 text-sm">尚未添加任何單字</p>
              )}
            </div>

            {/* 新增單字 */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 p-2 px-4 rounded-[30px] bg-hoverbg flex items-center gap-2">
                <input
                  type="text"
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  placeholder="輸入英文單字..."
                  className="flex-1 bg-transparent focus:outline-none text-foreground"
                  onKeyPress={(e) => e.key === "Enter" && handleAddWord()}
                />
              </div>
              <Button
                onClick={handleAddWord}
                disabled={!customWord.trim()}
                className="rounded-full px-6 text-[14px] py-3"
              >
                <Plus size={16} />
                新增
              </Button>
            </div>
          </div>

          {/* 開始測驗按鈕 */}
          <div className="flex items-center gap-3 justify-center fixed bottom-0 w-full left-0 p-4 px-6 shadow-2xl shadow-zinc-400 border-t-2 border-t-zinc-100 dark:border-t-borderColor">
            <Link
              href={"/"}
              className="bg-hoverbg rounded-full py-3 px-5 font-medium text-[14px]"
            >
              取消
            </Link>
            <button
              onClick={handleStartQuiz}
              disabled={words.length === 0}
              className="disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center grow rounded-[30px] text-[14px] py-3 font-medium bg-foreground opacity-85 text-background"
            >
              <div className="flex items-center gap-2">
                <Play size={18} strokeWidth={3} />
                開始測驗 ({words.length} 題)
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* 測驗模式 */
        <div className="p-5 space-y-6">
          {/* 進度指示器 */}
          <div className="bg-hoverbg rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">題目進度</span>
              <span className="text-sm text-zinc-500">
                {currentIndex + 1} / {quizList.length}
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div
                className="bg-inputPrimary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / quizList.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* 題目區域 */}
          {currentQuiz && (
            <div>
              {/* 題目 */}
              <div>
                <h3 className="font-medium mb-4 text-zinc-500">
                  題目 {currentIndex + 1}
                </h3>
                {(() => {
                  const { questionText, options } = parseQuestion(
                    currentQuiz.question,
                  );
                  return (
                    <div className="space-y-4">
                      <p className="text-lg leading-relaxed font-medium">
                        {questionText}
                      </p>

                      {/* 選項 */}
                      <div className="space-y-3">
                        {options.map((option, index) => {
                          const optionLetter =
                            option.match(/\(([A-D])\)/)?.[1] || "";
                          const isSelected = selectedAnswer === optionLetter;

                          let optionClass =
                            "p-4 border-2 rounded-xl cursor-pointer transition-all ";

                          if (showResult) {
                            if (optionLetter === currentQuiz.answer) {
                              optionClass +=
                                "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                            } else if (
                              isSelected &&
                              optionLetter !== currentQuiz.answer
                            ) {
                              optionClass +=
                                "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                            } else {
                              optionClass +=
                                "border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-500";
                            }
                          } else {
                            if (isSelected) {
                              optionClass +=
                                "border-inputPrimary bg-blue-50 dark:bg-blue-900/20 text-inputPrimary";
                            } else {
                              optionClass +=
                                "border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 bg-background";
                            }
                          }

                          return (
                            <div
                              key={index}
                              className={optionClass}
                              onClick={() => handleAnswerSelect(optionLetter)}
                            >
                              <p className="font-medium">{option}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 結果顯示 */}
              {showResult && (
                <div
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-lg font-semibold ${
                        isCorrect
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? "✅ 答對了！" : "❌ 答錯了！"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">正確答案：</span>
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {currentQuiz.answer}
                      </span>
                    </p>
                    <div>
                      <p className="font-medium text-sm mb-1">詳細解析：</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {currentQuiz.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 控制按鈕 */}
          <div className="flex gap-3">
            {/* 上一題按鈕 */}
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentIndex === 0}
              className="flex-1 rounded-2xl py-3"
            >
              <ChevronLeft size={16} />
              上一題
            </Button>

            {/* 中間按鈕 */}
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex-1 rounded-2xl py-3"
              >
                提交答案
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentIndex === quizList.length - 1}
                className="flex-1 rounded-2xl py-3"
              >
                下一題
                <ChevronRight size={16} />
              </Button>
            )}
          </div>

          {/* 完成提示 */}
          {showResult && currentIndex === quizList.length - 1 && (
            <div className="text-center p-6 bg-hoverbg rounded-2xl">
              <p className="text-lg font-medium mb-2">🎉 測驗完成！</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                你已經完成了所有 {quizList.length} 題測驗
              </p>
              <Button
                onClick={handleBackToSetup}
                variant="outline"
                className="rounded-2xl"
              >
                重新開始測驗
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
