
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Check, X } from "lucide-react";

interface ExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "linear" | "surface";
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
}

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

  return questionTypes[index % 3];
};

export const ExerciseModal = ({ 
  open, 
  onOpenChange, 
  type,
  currentQuestion,
  setCurrentQuestion
}: ExerciseModalProps) => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  
  const question = generateQuestion(type, currentQuestion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = Math.abs(Number(answer) - Number(question.answer)) < 0.001;
    setFeedback(isCorrect ? "correct" : "incorrect");
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setAnswer("");
    setFeedback(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Exercício {currentQuestion + 1}/90</h2>
            {feedback && (
              <div className={`flex items-center gap-2 ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}>
                {feedback === "correct" ? <Check /> : <X />}
                {feedback === "correct" ? "Correto!" : "Incorreto"}
              </div>
            )}
          </div>

          <p className="text-lg">{question.text}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Digite sua resposta"
              className="glass-panel"
            />
            
            <div className="flex gap-4">
              <Button type="submit" className="w-full neon-glow" disabled={!!feedback}>
                Verificar
              </Button>
              {feedback && (
                <Button onClick={handleNext} className="w-full" variant="secondary">
                  Próxima Questão
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
