import { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Check, X, Zap, Atom, ThermometerIcon, Award, 
  Timer, BookOpen, ArrowRight, BrainCircuit, Calculator, FlaskConical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "react-router-dom";

// Estilos CSS personalizados para o componente
const styles = {
  scrollContainer: `
    .custom-scrollbar ::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
    .custom-scrollbar ::-webkit-scrollbar-thumb {
      background: rgba(var(--primary-rgb), 0.3);
      border-radius: 4px;
      transition: background 0.3s ease;
    }
    .custom-scrollbar ::-webkit-scrollbar-thumb:hover {
      background: rgba(var(--primary-rgb), 0.5);
    }
    .smooth-scroll {
      scroll-behavior: smooth;
    }
  `
};

// Função auxiliar para embaralhar array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateQuestions = (type: "linear" | "surface") => {
  const materials = {
    linear: [
      { name: "Alumínio", coefficient: 23e-6 },
      { name: "Aço inoxidável", coefficient: 17.3e-6 },
      { name: "Cobre", coefficient: 17e-6 },
      { name: "Ferro", coefficient: 12e-6 },
      { name: "Ouro", coefficient: 14.2e-6 },
      { name: "Prata", coefficient: 19.7e-6 },
      { name: "Vidro comum", coefficient: 9e-6 },
      { name: "Tungstênio", coefficient: 4.5e-6 },
      { name: "Platina", coefficient: 9e-6 }
    ],
    surface: [
      { name: "Latão", coefficient: 19e-6 },      // β=38e-6 (2α)
      { name: "Bronze", coefficient: 18e-6 },     // β=36e-6 (2α)
      { name: "Zinco", coefficient: 26e-6 },      // β=52e-6 (2α)
      { name: "Alumínio", coefficient: 23e-6 },   // β=46e-6 (2α)
      { name: "Cobre", coefficient: 17e-6 },      // β=34e-6 (2α)
      { name: "Vidro comum", coefficient: 9e-6 }, // β=18e-6 (2α)
      { name: "Aço inoxidável", coefficient: 17.3e-6 }, // β=34.6e-6 (2α)
      { name: "Prata", coefficient: 19.7e-6 },    // β=39.4e-6 (2α)
      { name: "Titânio", coefficient: 8.6e-6 }    // β=17.2e-6 (2α)
    ]
  };

  return Array.from({ length: 90 }, (_, index) => {
    const material = materials[type][index % materials[type].length];
    const initialTemp = type === "linear" ? 
      (25 + Math.floor(index / 3) * 5) % 40 : 
      (20 + Math.floor(index / 3) * 4) % 35;
    const finalTemp = type === "linear" ? 
      (initialTemp + 100 + (index % 150)) % 350 : 
      (initialTemp + 120 + (index % 130)) % 300;
    const initialSize = type === "linear" ? 
      (1 + (index % 9) * 0.5) : // 1m a 5m para barras
      (0.5 + (index % 10) * 0.2); // 0.5m² a 2.5m² para placas
    
    const deltaT = finalTemp - initialTemp;
    const deltaSize = type === "linear" 
      ? initialSize * material.coefficient * deltaT
      : initialSize * 2 * material.coefficient * deltaT;

    // Determine question type based on index (distribute evenly among 5 types)
    const questionType = index % 5;
    
    let text, correctAnswer, options, explanation;
    
    switch (questionType) {
      case 0: // Determine variation (original type)
        text = `${index + 1}. Em um projeto de ${index % 2 === 0 ? "construção civil" : "engenharia mecânica"}, uma ${type === "linear" ? "barra" : "placa"} de ${material.name} possui ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} a ${initialTemp}°C. Para garantir a segurança estrutural, é necessário calcular sua ${type === "linear" ? "variação no comprimento" : "variação na área"} quando exposta a ${finalTemp}°C em condições de operação.

Coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"} do ${material.name}: ${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹${type === "surface" ? " (onde β = 2α)" : ""}`;
        correctAnswer = deltaSize.toFixed(6);
        options = shuffleArray([
          (Number(correctAnswer) * (1 - 0.15)).toFixed(6),
          (Number(correctAnswer) * (1 + 0.30)).toFixed(6),
          correctAnswer,
          (Number(correctAnswer) * (1 + 0.15)).toFixed(6)
        ]);
        explanation = `Para calcular a ${type === "linear" ? "variação no comprimento (ΔL)" : "variação na área (ΔA)"}, usamos a fórmula: 
        
${type === "linear" ? "ΔL = L₀ · α · ΔT" : "ΔA = A₀ · β · ΔT"}

Onde:
- ${type === "linear" ? "L₀" : "A₀"} = ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} (${type === "linear" ? "comprimento" : "área"} inicial)
- ${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹ (coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"} do ${material.name})${type === "surface" ? ". Lembrando que β = 2α" : ""}
- ΔT = ${finalTemp} - ${initialTemp} = ${deltaT.toFixed(1)} °C (variação de temperatura)

Substituindo na fórmula:
${type === "linear" ? "ΔL" : "ΔA"} = ${initialSize.toFixed(2)} · ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ · ${deltaT.toFixed(1)}
${type === "linear" ? "ΔL" : "ΔA"} = ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"}`;
        break;
        
      case 1: // Determine coefficient
        text = `${index + 1}. Durante um teste de caracterização de materiais em laboratório, uma ${type === "linear" ? "barra" : "placa"} de material metálico desconhecido possui ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} a ${initialTemp}°C e sofre uma ${type === "linear" ? "variação no comprimento" : "variação na área"} de ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"} quando aquecida a ${finalTemp}°C. Para identificar este material, é necessário determinar seu coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"}.`;
        
        // Formatação correta do coeficiente com unidades
        const formattedCoefficient = `${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹`;
        correctAnswer = formattedCoefficient;
        
        options = shuffleArray([
          `${(material.coefficient * (type === "linear" ? 1 : 2) * 0.85 * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹`,
          `${(material.coefficient * (type === "linear" ? 1 : 2) * 1.30 * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹`,
          formattedCoefficient,
          `${(material.coefficient * (type === "linear" ? 1 : 2) * 1.15 * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹`
        ]);
        explanation = `Para calcular o coeficiente de dilatação ${type === "linear" ? "linear (α)" : "superficial (β)"}, podemos isolar o coeficiente na fórmula:

${type === "linear" ? "ΔL = L₀ · α · ΔT" : "ΔA = A₀ · β · ΔT"}

Reorganizando:
${type === "linear" ? "α = ΔL / (L₀ · ΔT)" : "β = ΔA / (A₀ · ΔT)"}

Onde:
- ${type === "linear" ? "ΔL" : "ΔA"} = ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"} (variação no ${type === "linear" ? "comprimento" : "área"})
- ${type === "linear" ? "L₀" : "A₀"} = ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} (${type === "linear" ? "comprimento" : "área"} inicial)
- ΔT = ${finalTemp} - ${initialTemp} = ${deltaT.toFixed(1)} °C (variação de temperatura)

Substituindo na fórmula:
${type === "linear" ? "α" : "β"} = ${deltaSize.toFixed(6)} / (${initialSize.toFixed(2)} · ${deltaT.toFixed(1)})
${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹${type === "surface" ? "\n\nLembrando que para dilatação superficial, β = 2α (o coeficiente de dilatação superficial é o dobro do linear)" : ""}

Este coeficiente é característico do ${material.name}.`;
        break;
        
      case 2: // Determine initial temperature
        text = `${index + 1}. Em um sistema de monitoramento térmico industrial, uma ${type === "linear" ? "barra" : "placa"} de ${material.name} de ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} sofre uma ${type === "linear" ? "variação no comprimento" : "variação na área"} de ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"} quando aquecida até ${finalTemp}°C. Para calibrar o sistema de proteção, é necessário determinar qual era a temperatura inicial da ${type === "linear" ? "barra" : "placa"}.

Coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"} do ${material.name}: ${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹${type === "surface" ? " (onde β = 2α)" : ""}`;
        correctAnswer = `${initialTemp.toFixed(2)} °C`;
        options = shuffleArray([
          `${(initialTemp * 0.85).toFixed(2)} °C`,
          `${(initialTemp * 1.30).toFixed(2)} °C`,
          correctAnswer,
          `${(initialTemp * 1.15).toFixed(2)} °C`
        ]);
        explanation = `Para encontrar a temperatura inicial (T₁), precisamos reorganizar a fórmula da dilatação ${type === "linear" ? "linear" : "superficial"}:

${type === "linear" ? "ΔL = L₀ · α · (T₂ - T₁)" : "ΔA = A₀ · β · (T₂ - T₁)"}

Onde:
- ${type === "linear" ? "ΔL" : "ΔA"} = ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"} (variação no ${type === "linear" ? "comprimento" : "área"})
- ${type === "linear" ? "L₀" : "A₀"} = ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} (${type === "linear" ? "comprimento" : "área"} inicial)
- ${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹ (coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"} do ${material.name})${type === "surface" ? ". Lembrando que β = 2α" : ""}
- T₂ = ${finalTemp} °C (temperatura final)

Isolando T₁:
T₂ - T₁ = ${type === "linear" ? "ΔL / (L₀ · α)" : "ΔA / (A₀ · β)"}
T₁ = T₂ - ${type === "linear" ? "ΔL / (L₀ · α)" : "ΔA / (A₀ · β)"}

Substituindo:
T₁ = ${finalTemp} - ${deltaSize.toFixed(6)} / (${initialSize.toFixed(2)} · ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶)
T₁ = ${initialTemp.toFixed(2)} °C`;
        break;
        
      case 3: // Determine final temperature
        text = `${index + 1}. Em um processo industrial de ${index % 2 === 0 ? "tratamento térmico" : "fabricação de componentes"}, uma ${type === "linear" ? "barra" : "placa"} de ${material.name} de ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} a ${initialTemp}°C sofre uma ${type === "linear" ? "variação no comprimento" : "variação na área"} de ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"}. Para garantir a qualidade do produto, é preciso determinar qual foi a temperatura final atingida pela ${type === "linear" ? "barra" : "placa"}.

Coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"} do ${material.name}: ${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹${type === "surface" ? " (onde β = 2α)" : ""}`;
        correctAnswer = `${finalTemp.toFixed(2)} °C`;
        options = shuffleArray([
          `${(finalTemp * 0.85).toFixed(2)} °C`,
          `${(finalTemp * 1.30).toFixed(2)} °C`,
          correctAnswer,
          `${(finalTemp * 1.15).toFixed(2)} °C`
        ]);
        explanation = `Para encontrar a temperatura final (T₂), usamos a fórmula da dilatação ${type === "linear" ? "linear" : "superficial"}:

${type === "linear" ? "ΔL = L₀ · α · (T₂ - T₁)" : "ΔA = A₀ · β · (T₂ - T₁)"}

Onde:
- ${type === "linear" ? "ΔL" : "ΔA"} = ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"} (variação no ${type === "linear" ? "comprimento" : "área"})
- ${type === "linear" ? "L₀" : "A₀"} = ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} (${type === "linear" ? "comprimento" : "área"} inicial)
- ${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹ (coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"} do ${material.name})${type === "surface" ? ". Lembrando que β = 2α" : ""}
- T₁ = ${initialTemp} °C (temperatura inicial)

Isolando T₂:
T₂ - T₁ = ${type === "linear" ? "ΔL / (L₀ · α)" : "ΔA / (A₀ · β)"}
T₂ = T₁ + ${type === "linear" ? "ΔL / (L₀ · α)" : "ΔA / (A₀ · β)"}

Substituindo:
T₂ = ${initialTemp} + ${deltaSize.toFixed(6)} / (${initialSize.toFixed(2)} · ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶)
T₂ = ${finalTemp.toFixed(2)} °C`;
        break;
        
      case 4: // Determine variation of temperature
        text = `${index + 1}. Durante o projeto de um sistema de ${index % 2 === 0 ? "aquecimento industrial" : "refrigeração em equipamentos eletrônicos"}, uma ${type === "linear" ? "barra" : "placa"} de ${material.name} de ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} sofre uma ${type === "linear" ? "variação no comprimento" : "variação na área"} de ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"}. Para especificar o controle de temperatura necessário, deve-se calcular a variação de temperatura que causou essa dilatação.

Coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"} do ${material.name}: ${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹${type === "surface" ? " (onde β = 2α)" : ""}`;
        correctAnswer = `${deltaT.toFixed(2)} °C`;
        options = shuffleArray([
          `${(deltaT * 0.85).toFixed(2)} °C`,
          `${(deltaT * 1.30).toFixed(2)} °C`,
          correctAnswer,
          `${(deltaT * 1.15).toFixed(2)} °C`
        ]);
        explanation = `Para encontrar a variação de temperatura (ΔT), isolamos essa variável na fórmula da dilatação ${type === "linear" ? "linear" : "superficial"}:

${type === "linear" ? "ΔL = L₀ · α · ΔT" : "ΔA = A₀ · β · ΔT"}

Onde:
- ${type === "linear" ? "ΔL" : "ΔA"} = ${deltaSize.toFixed(6)} ${type === "linear" ? "metros" : "m²"} (variação no ${type === "linear" ? "comprimento" : "área"})
- ${type === "linear" ? "L₀" : "A₀"} = ${initialSize.toFixed(2)} ${type === "linear" ? "metros" : "m²"} (${type === "linear" ? "comprimento" : "área"} inicial)
- ${type === "linear" ? "α" : "β"} = ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶ °C⁻¹ (coeficiente de dilatação ${type === "linear" ? "linear" : "superficial"} do ${material.name})${type === "surface" ? ". Lembrando que β = 2α" : ""}

Isolando ΔT:
ΔT = ${type === "linear" ? "ΔL / (L₀ · α)" : "ΔA / (A₀ · β)"}

Substituindo:
ΔT = ${deltaSize.toFixed(6)} / (${initialSize.toFixed(2)} · ${(material.coefficient * (type === "linear" ? 1 : 2) * 1e6).toFixed(1)} × 10⁻⁶)
ΔT = ${deltaT.toFixed(2)} °C`;
        break;
    }

    return {
      id: index,
      text,
      options,
      correctAnswer,
      explanation
    };
  });
};

// Componente de opção de resposta memoizado para evitar re-renders desnecessários
const AnswerOption = memo(({ 
  option, 
  optionIndex, 
  type, 
  index, 
  isSelected, 
  isCorrect, 
  isAnswered, 
  correctAnswer,
  onSelect 
}: { 
  option: string, 
  optionIndex: number, 
  type: "linear" | "surface", 
  index: number, 
  isSelected: boolean, 
  isCorrect: boolean | undefined, 
  isAnswered: boolean,
  correctAnswer: string,
  onSelect: (option: string) => void 
}) => {
  const isCorrectOption = option === correctAnswer;
  const isWrongSelected = isSelected && isCorrect === false;
  
  const bgColorClass = 
    isSelected ? (type === "linear" ? "bg-cyan-500/20" : "bg-purple-500/20") :
    "bg-black/20";
  
  const borderColorClass = 
    isSelected ? (type === "linear" ? "border-cyan-500/40" : "border-purple-500/40") :
    (type === "linear" ? "border-cyan-500/10" : "border-purple-500/10");
    
  // Letras para as alternativas
  const letters = ["a", "b", "c", "d"];
  
  // Usar uma função que não causa re-render
  const handleOptionSelect = () => {
    if (!isAnswered) {
      onSelect(option);
    }
  };
  
  return (
    <div 
      className={`relative flex items-center px-4 py-3 rounded-lg cursor-pointer border ${bgColorClass} ${borderColorClass}`}
      onClick={handleOptionSelect}
    >
      <RadioGroupItem
        value={option}
        id={`${type}-${index}-${optionIndex}`}
        disabled={isAnswered}
        className={type === "linear" ? "border-cyan-500/40" : "border-purple-500/40"}
      />
      <div className="flex items-center gap-3 w-full">
        <span className={`font-bold text-sm ${type === "linear" ? "text-cyan-400" : "text-purple-400"}`}>
          {letters[optionIndex]}
        </span>
        <Label 
          htmlFor={`${type}-${index}-${optionIndex}`}
          className="w-full cursor-pointer font-mono text-sm"
        >
          {option}
        </Label>
      </div>
      
      {/* Highlight de resposta correta/incorreta */}
      {isAnswered && isCorrectOption && (
        <div className="absolute right-2 text-green-500">
          <Check className="h-4 w-4" />
        </div>
      )}
      
      {isWrongSelected && (
        <div className="absolute right-2 text-red-500">
          <X className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Implementar uma função de comparação personalizada para evitar re-renders desnecessários
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isAnswered === nextProps.isAnswered &&
    prevProps.isCorrect === nextProps.isCorrect
  );
});
AnswerOption.displayName = "AnswerOption";

// Componente de questão memoizado para evitar re-renders desnecessários
const QuestionCard = memo(({ 
  question, 
  index, 
  type, 
  answer, 
  isCorrect, 
  onAnswer 
}: { 
  question: ReturnType<typeof generateQuestions>[0], 
  index: number, 
  type: "linear" | "surface", 
  answer: string | undefined, 
  isCorrect: boolean | undefined,
  onAnswer: (questionId: string, answer: string) => void 
}) => {
  // Função para obter ícone baseado no tipo de questão
  const getQuestionIcon = () => {
    const questionType = index % 5;
    switch (questionType) {
      case 0: return <Zap className="w-5 h-5 text-cyan-400" />;
      case 1: return <Calculator className="w-5 h-5 text-purple-400" />;
      case 2: return <ThermometerIcon className="w-5 h-5 text-red-400" />;
      case 3: return <ThermometerIcon className="w-5 h-5 text-orange-400" />;
      case 4: return <BrainCircuit className="w-5 h-5 text-yellow-400" />;
      default: return <FlaskConical className="w-5 h-5 text-green-400" />;
    }
  };
  
  const isAnswered = answer !== undefined;

  // Memoizar o handler para evitar re-renders
  const handleAnswerSelection = useCallback((value: string) => {
    onAnswer(`${type}-${index}`, value);
  }, [type, index, onAnswer]);
  
  // Memoizar o ícone para evitar re-renders
  const questionIcon = useMemo(() => getQuestionIcon(), [index]);

  // Formatar o texto da questão para destacar o coeficiente se existir
  const formattedQuestionText = useMemo(() => {
    const parts = question.text.split("\n\n");
    
    if (parts.length === 1) {
      return <p className="text-lg">{parts[0]}</p>;
    } else {
      return (
        <>
          <p className="text-lg mb-2">{parts[0]}</p>
          <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20 font-mono text-sm">
            <span className={`${type === "linear" ? "text-cyan-400" : "text-purple-400"} font-bold`}>
              {parts[1]}
            </span>
          </div>
        </>
      );
    }
  }, [question.text, type]);
  
  return (
    <Card className={`backdrop-blur-md ${type === "linear" ? "bg-gradient-to-r from-black/40 to-cyan-950/10" : "bg-gradient-to-r from-black/40 to-purple-950/10"} border ${type === "linear" ? "border-cyan-500/20" : "border-purple-500/20"} shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all duration-300 overflow-hidden`}>
      {/* Indicator de questão respondida */}
      {isAnswered && (
        <div className={`absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] ${isCorrect ? "border-t-green-500/30 border-r-transparent" : "border-t-red-500/30 border-r-transparent"}`} />
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-1 flex-shrink-0">
            <div className={`p-2 rounded-full ${type === "linear" ? "bg-cyan-500/10" : "bg-purple-500/10"}`}>
              {questionIcon}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Questão {index + 1}</p>
            {formattedQuestionText}
          </div>
        </div>
        
        <RadioGroup
          value={answer}
          onValueChange={handleAnswerSelection}
          className="ml-12 mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option, optionIndex) => (
              <AnswerOption
                key={optionIndex}
                option={option}
                optionIndex={optionIndex}
                type={type}
                index={index}
                isSelected={answer === option}
                isCorrect={isCorrect}
                isAnswered={isAnswered}
                correctAnswer={question.correctAnswer}
                onSelect={handleAnswerSelection}
              />
            ))}
          </div>
        </RadioGroup>

        {isAnswered && (
          <div 
            className={`mt-6 ml-12 py-3 px-4 rounded-lg backdrop-blur-sm ${
              isCorrect 
                ? "bg-green-500/10 border border-green-500/30" 
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {isCorrect 
                ? <><Check className="h-5 w-5 text-green-500" /> <span className="font-medium text-green-500">Correto!</span></>
                : <><X className="h-5 w-5 text-red-500" /> <span className="font-medium text-red-500">Incorreto</span></>
              }
            </div>
            
            {!isCorrect && (
              <>
                <p className="mt-2 text-sm">
                  A resposta correta é <span className="font-bold text-gray-300">{question.correctAnswer}</span>
                </p>
                <div className="mt-4 p-4 bg-black/30 border border-primary/20 rounded-lg font-mono text-sm text-gray-300 whitespace-pre-line">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-primary">Explicação Detalhada</h4>
                  </div>
                  {question.explanation}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Implementar uma função de comparação personalizada para evitar re-renders desnecessários
  return (
    prevProps.question === nextProps.question &&
    prevProps.answer === nextProps.answer &&
    prevProps.isCorrect === nextProps.isCorrect
  );
});
QuestionCard.displayName = "QuestionCard";

// Componente principal
const Questions = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("linear");
  const [statsVisible, setStatsVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState({ linear: 0, surface: 0 });
  const location = useLocation();
  
  // Verificar parâmetros de URL ao carregar a página
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === "surface") {
      setActiveTab("surface");
    }
  }, [location.search]);

  // Memoizando as questões para evitar recriação a cada render
  const linearQuestions = useMemo(() => generateQuestions("linear"), []);
  const surfaceQuestions = useMemo(() => generateQuestions("surface"), []);
  
  // Memoizar função para mudar de aba
  const handleTabChange = useCallback((value: string) => {
    if (value === activeTab) return;
    setActiveTab(value);
  }, [activeTab]);

  // Lidar com a resposta do usuário - memoizado para evitar recriação
  const handleAnswer = useCallback((questionId: string, answer: string) => {
    // Evitar processamento se a resposta já foi dada
    if (answers[questionId] === answer) return;
    
    // Preparar para avaliação
    const [type, id] = questionId.split("-");
    const questions = type === "linear" ? linearQuestions : surfaceQuestions;
    const question = questions[Number(id)];
    const questionType = Number(id) % 5;
    
    // Avaliar a resposta
    let isCorrect;
    
    switch (questionType) {
      case 0: // Variation of length/area
        isCorrect = Math.abs(Number(answer) - Number(question.correctAnswer)) < 0.000001;
        break;
      case 1: // Coefficient
        isCorrect = answer === question.correctAnswer;
        break;
      case 2: // Initial temperature
      case 3: // Final temperature
      case 4: // Temperature variation
        const numericAnswer = parseFloat(answer.replace(" °C", ""));
        const numericCorrectAnswer = parseFloat(question.correctAnswer.replace(" °C", ""));
        isCorrect = Math.abs(numericAnswer - numericCorrectAnswer) < 0.01;
        break;
    }
    
    // Usar um único batch de atualização para evitar re-renders múltiplos
    const updatedAnswers = { ...answers, [questionId]: answer };
    const updatedFeedback = { ...feedback, [questionId]: isCorrect };
    
    // Atualizar os estados
    setAnswers(updatedAnswers);
    setFeedback(updatedFeedback);
  }, [answers, feedback, linearQuestions, surfaceQuestions]);

  // Funções de navegação memoizadas
  const goToNextQuestion = useCallback((type: "linear" | "surface") => {
    const questions = type === "linear" ? linearQuestions : surfaceQuestions;
    const currentIndex = currentQuestionIndex[type];
    
    if (currentIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => ({
        ...prev,
        [type]: currentIndex + 1
      }));
    }
  }, [currentQuestionIndex, linearQuestions, surfaceQuestions]);
  
  const goToPreviousQuestion = useCallback((type: "linear" | "surface") => {
    const currentIndex = currentQuestionIndex[type];
    
    if (currentIndex > 0) {
      setCurrentQuestionIndex(prev => ({
        ...prev,
        [type]: currentIndex - 1
      }));
    }
  }, [currentQuestionIndex]);
  
  // Função para verificar se pode avançar para a próxima questão
  const canGoToNextQuestion = useCallback((type: "linear" | "surface") => {
    const currentIndex = currentQuestionIndex[type];
    const currentQuestionId = `${type}-${currentIndex}`;
    const isCurrentQuestionAnswered = answers[currentQuestionId] !== undefined;
    return isCurrentQuestionAnswered;
  }, [answers, currentQuestionIndex]);

  // Memoizar cálculos de estatísticas
  const linearStats = useMemo(() => calculateStats("linear"), [answers, feedback, linearQuestions]);
  const surfaceStats = useMemo(() => calculateStats("surface"), [answers, feedback, surfaceQuestions]);

  // Calcular estatísticas
  function calculateStats(type: "linear" | "surface") {
    const questions = type === "linear" ? linearQuestions : surfaceQuestions;
    const total = questions.length;
    const answered = Object.keys(answers).filter(key => key.startsWith(type)).length;
    const correct = Object.entries(feedback)
      .filter(([key, value]) => key.startsWith(type) && value === true)
      .length;
    
    const percentAnswered = (answered / total) * 100;
    const percentCorrect = answered > 0 ? (correct / answered) * 100 : 0;
    
    return {
      total,
      answered,
      correct,
      percentAnswered,
      percentCorrect
    };
  }

  // Componente de lista de questões
  const QuestionList = ({ questions, type }: { questions: typeof linearQuestions, type: "linear" | "surface" }) => {
    const stats = type === "linear" ? linearStats : surfaceStats;
    const currentIndex = currentQuestionIndex[type];
    const currentQuestion = questions[currentIndex];
    const isCurrentQuestionAnswered = answers[`${type}-${currentIndex}`] !== undefined;
    const isCorrect = feedback[`${type}-${currentIndex}`];
    
    // Usar referência para evitar recálculo desnecessário
    const cardRef = useRef<HTMLDivElement>(null);
    
    // Memoizar handlers para evitar re-renders
    const toggleStats = useCallback(() => {
      setStatsVisible(!statsVisible);
    }, [statsVisible]);
    
    const handlePrevious = useCallback(() => {
      goToPreviousQuestion(type);
    }, [type]);
    
    const handleNext = useCallback(() => {
      goToNextQuestion(type);
    }, [type]);
    
    // Memorizar componentes para evitar re-renderizações
    const statsSection = useMemo(() => (
      <AnimatePresence presenceAffectsLayout={false}>
        {statsVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 gap-4 mb-4"
          >
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Timer className="w-5 h-5 text-primary mb-1" />
              <p className="text-xs text-gray-400">Progresso</p>
              <p className="text-xl font-bold">{stats.answered}/{stats.total}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <Check className="w-5 h-5 text-green-500 mb-1" />
              <p className="text-xs text-gray-400">Corretas</p>
              <p className="text-xl font-bold text-green-500">{stats.correct}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <X className="w-5 h-5 text-red-500 mb-1" />
              <p className="text-xs text-gray-400">Incorretas</p>
              <p className="text-xl font-bold text-red-500">{stats.answered - stats.correct}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    ), [statsVisible, stats.answered, stats.total, stats.correct]);
    
    const progressBars = useMemo(() => (
      <div className="space-y-1">
        <div className="flex justify-between text-xs mb-1">
          <span>Progresso total</span>
          <span>{Math.round(stats.percentAnswered)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.percentAnswered}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          />
        </div>
        
        {stats.answered > 0 && (
          <>
            <div className="flex justify-between text-xs mb-1 mt-2">
              <span>Taxa de acerto</span>
              <span>{Math.round(stats.percentCorrect)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentCorrect}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              />
            </div>
          </>
        )}
      </div>
    ), [stats.percentAnswered, stats.percentCorrect, stats.answered]);
    
    // Usar layout fixo para evitar ajustes que causam flicker
    return (
      <div className="relative">
        {/* Header com estatísticas e progresso */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 backdrop-blur-md bg-black/30 border border-primary/20 rounded-xl p-4 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]"
          layout={false}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${type === "linear" ? "bg-cyan-500/20" : "bg-purple-500/20"}`}>
                {type === "linear" ? (
                  <ArrowRight className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Atom className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <h2 className="text-xl font-bold">{type === "linear" ? "Dilatação Linear" : "Dilatação Superficial"}</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleStats}
                className="text-sm flex items-center gap-1"
              >
                <Award className="w-4 h-4" />
                {statsVisible ? "Ocultar Estatísticas" : "Ver Estatísticas"}
              </Button>
            </div>
          </div>
          
          {/* Indicador de progresso */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Questão {currentIndex + 1} de {questions.length}</span>
              <span className="text-sm">{Math.round((currentIndex + 1) / questions.length * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full ${type === "linear" ? "bg-gradient-to-r from-cyan-400 to-blue-500" : "bg-gradient-to-r from-purple-400 to-pink-500"} rounded-full`}
              />
            </div>
          </div>
          
          {statsSection}
          {progressBars}
        </motion.div>
        
        {/* Questão atual - usando div com key para forçar remontagem apenas quando necessário */}
        <div 
          key={`${type}-question-container-${currentIndex}`}
          className="mb-6 question-card"
          ref={cardRef}
        >
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            type={type}
            answer={answers[`${type}-${currentIndex}`]}
            isCorrect={isCorrect}
            onAnswer={handleAnswer}
          />
        </div>
        
        {/* Botões de navegação */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`${type === "linear" ? "border-cyan-500/50 hover:bg-cyan-500/10" : "border-purple-500/50 hover:bg-purple-500/10"} gap-2`}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Anterior
          </Button>
          
          <Button
            variant="default"
            size="lg"
            onClick={handleNext}
            disabled={!canGoToNextQuestion(type) || currentIndex === questions.length - 1}
            className={`${type === "linear" ? "bg-cyan-600 hover:bg-cyan-700" : "bg-purple-600 hover:bg-purple-700"} gap-2`}
          >
            Próxima
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-background to-secondary/20 bg-fixed">
      <style jsx global>{styles.scrollContainer}</style>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent relative z-10">
            Exercícios
          </h1>
          <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
          <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur-md"></div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-black/40 backdrop-blur-md border border-primary/20 rounded-xl">
            <TabsTrigger 
              value="linear" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-300 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span>Dilatação Linear</span>
                {linearStats.answered > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-xs font-medium text-cyan-400">
                    {linearStats.answered}/{linearStats.total}
                  </span>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="surface" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Atom className="h-4 w-4" />
                <span>Dilatação Superficial</span>
                {surfaceStats.answered > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-purple-500/20 px-1.5 py-0.5 text-xs font-medium text-purple-400">
                    {surfaceStats.answered}/{surfaceStats.total}
                  </span>
                )}
              </div>
            </TabsTrigger>
          </TabsList>
          
          <div className="relative">
            {activeTab === "linear" && (
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -top-4 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-50 origin-left"
              ></motion.div>
            )}
            
            {activeTab === "surface" && (
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -top-4 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50 origin-left"
              ></motion.div>
            )}
            
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "linear" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "linear" ? 20 : -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TabsContent value={activeTab} forceMount>
                  <QuestionList 
                    questions={activeTab === "linear" ? linearQuestions : surfaceQuestions} 
                    type={activeTab as "linear" | "surface"} 
                  />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Questions;
