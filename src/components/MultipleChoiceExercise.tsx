import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MultipleChoiceExerciseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "linear" | "surface";
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
}

const generateOptions = (correctAnswer: string, questionIndex: number, questionType: number) => {
  const correctNumber = Number(correctAnswer);
  let wrongAnswers: string[] = [];
  
  // Create more diverse wrong answers based on question type
  if (questionType === 0) { // Variation calculation question
    const variation = 0.15;
    wrongAnswers = [
      (correctNumber * (1 + variation)).toFixed(6),
      (correctNumber * (1 - variation)).toFixed(6),
      (correctNumber * (1 + variation * 2)).toFixed(6),
    ];
  } else if (questionType === 1) { // Temperature question
    // For temperature questions, use different offsets
    wrongAnswers = [
      (correctNumber + 5).toFixed(0),
      (correctNumber - 8).toFixed(0),
      (correctNumber + 12).toFixed(0),
    ];
  } else { // Coefficient question
    // For coefficient questions, which are in scientific notation
    const coef = parseFloat(correctAnswer);
    wrongAnswers = [
      (coef * 1.2).toExponential(2),
      (coef * 0.8).toExponential(2),
      (coef * 1.5).toExponential(2),
    ];
  }
  
  // Shuffle the wrong answers based on questionIndex
  const shuffleWrong = [...wrongAnswers];
  for (let i = shuffleWrong.length - 1; i > 0; i--) {
    const j = (i + questionIndex) % shuffleWrong.length;
    [shuffleWrong[i], shuffleWrong[j]] = [shuffleWrong[j], shuffleWrong[i]];
  }
  
  // Position correct answer deterministically based on question index
  // Use the question index modulo 4 to get positions 0-3
  const correctPosition = questionIndex % 4;
  
  // Place shuffled wrong answers
  const options = [...shuffleWrong];
  
  // Insert the correct answer at the calculated position
  options.splice(correctPosition, 0, correctAnswer);
  
  return options;
};

const generateQuestion = (type: "linear" | "surface", index: number) => {
  const materials = {
    linear: [
      { name: "Alumínio", coefficient: 24e-6 },
      { name: "Aço", coefficient: 12e-6 },
      { name: "Cobre", coefficient: 17e-6 }
    ],
    surface: [
      { name: "Alumínio", coefficient: 48e-6 },
      { name: "Aço", coefficient: 24e-6 },
      { name: "Vidro", coefficient: 16e-6 }
    ]
  };

  const material = materials[type][index % 3];
  const initialTemp = Math.floor(Math.random() * 30);
  const finalTemp = initialTemp + Math.floor(Math.random() * 70) + 20;
  const initialSize = Math.floor(Math.random() * 90) + 10;
  
  const deltaT = finalTemp - initialTemp;
  const deltaSize = type === "linear" 
    ? initialSize * material.coefficient * deltaT
    : initialSize * material.coefficient * deltaT;

  const questionTypes = [
    {
      text: `Uma ${type === "linear" ? "barra" : "placa"} de ${material.name} possui ${initialSize} ${type === "linear" ? "metros" : "m²"} a ${initialTemp}°C. Qual será sua ${type === "linear" ? "variação no comprimento" : "variação na área"} quando aquecida a ${finalTemp}°C?`,
      answer: deltaSize.toFixed(6)
    },
    {
      text: `Uma ${type === "linear" ? "barra" : "placa"} de ${material.name} a ${initialTemp}°C sofreu uma ${type === "linear" ? "variação no comprimento" : "variação na área"} de ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"}. Determine a temperatura final.`,
      answer: finalTemp.toString()
    },
    {
      text: `Determine o coeficiente de dilatação ${type} do ${material.name} sabendo que uma ${type === "linear" ? "barra" : "placa"} de ${initialSize} ${type === "linear" ? "metros" : "m²"} sofreu uma variação de ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"} ao ser aquecida de ${initialTemp}°C para ${finalTemp}°C.`,
      answer: material.coefficient.toExponential(2)
    }
  ];

  const questionType = index % 3;
  const question = questionTypes[questionType];
  const options = generateOptions(question.answer, index, questionType);
  
  return { ...question, options };
};

export const MultipleChoiceExercise = ({ 
  open, 
  onOpenChange, 
  type,
  currentQuestion,
  setCurrentQuestion
}: MultipleChoiceExerciseProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const { toast } = useToast();
  
  const question = generateQuestion(type, currentQuestion);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "Selecione uma alternativa",
        description: "Você precisa escolher uma resposta antes de verificar.",
        variant: "destructive"
      });
      return;
    }
    
    const isCorrect = Math.abs(Number(selectedAnswer) - Number(question.answer)) < 0.001;
    setFeedback(isCorrect ? "correct" : "incorrect");
    
    if (isCorrect) {
      toast({
        title: "Correto!",
        description: "Muito bem! Continue praticando.",
        variant: "default"
      });
    } else {
      toast({
        title: "Incorreto",
        description: "Tente novamente!",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer("");
    setFeedback(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel">
        <DialogTitle className="text-2xl font-bold">
          Exercício {currentQuestion + 1}/90
        </DialogTitle>
        <DialogDescription className="text-lg">
          {question.text}
        </DialogDescription>

        <div className="space-y-6">
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                  feedback && option === question.answer 
                    ? "bg-green-500/20 border border-green-500/30" 
                    : feedback && selectedAnswer === option && option !== question.answer 
                    ? "bg-red-500/20 border border-red-500/30"
                    : ""
                }`}
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  disabled={!!feedback}
                  className="border-primary text-primary"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="text-base cursor-pointer flex-grow"
                >
                  {option}
                </Label>
                {feedback && option === question.answer && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                {feedback && selectedAnswer === option && option !== question.answer && (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              className="w-full neon-glow"
              disabled={!!feedback}
            >
              Verificar
            </Button>
            {feedback && (
              <Button onClick={handleNext} className="w-full" variant="secondary">
                Próxima Questão
              </Button>
            )}
          </div>

          {feedback && (
            <div className={`flex items-center gap-2 ${
              feedback === "correct" ? "text-green-500" : "text-red-500"
            }`}>
              {feedback === "correct" ? <Check /> : <X />}
              {feedback === "correct" ? "Correto!" : "Incorreto"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
