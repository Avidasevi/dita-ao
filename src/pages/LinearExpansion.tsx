import { Header } from "@/components/Header";
import { ThermometerIcon, BookOpenIcon, FlaskConicalIcon, GraduationCapIcon, RulerIcon, BarChartIcon } from "lucide-react";
import { useState } from "react";
import { MultipleChoiceExercise } from "@/components/MultipleChoiceExercise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const LinearExpansion = () => {
  const [showExercise, setShowExercise] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="glass-panel p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dilatação Linear
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ThermometerIcon className="text-primary" />
                Conceito Fundamental
              </h2>
              <p className="mb-4">
                A dilatação linear é o fenômeno físico onde um material expande-se em uma única dimensão quando submetido a uma variação de temperatura. Este processo é governado pela equação fundamental:
              </p>
              <div className="glass-panel p-4 neon-glow mb-4">
                <p className="text-lg font-bold text-center">ΔL = L₀ · α · ΔT</p>
                <div className="text-sm mt-2 space-y-1">
                  <p>Onde:</p>
                  <p>ΔL = Variação no comprimento</p>
                  <p>L₀ = Comprimento inicial</p>
                  <p>α = Coeficiente de dilatação linear</p>
                  <p>ΔT = Variação de temperatura</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <RulerIcon className="text-primary" />
                Características Importantes
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>O coeficiente α é uma propriedade específica de cada material</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>A dilatação é diretamente proporcional ao comprimento inicial</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>O processo é reversível: o material contrai ao resfriar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>A variação é linear apenas para pequenas variações de temperatura</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpenIcon className="text-primary" />
            Coeficientes de Dilatação Linear (α)
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                material: "Alumínio",
                coeficiente: "24 × 10⁻⁶ °C⁻¹",
                aplicacoes: ["Estruturas leves", "Aeronaves", "Satélites"],
                caracteristicas: "Alta resistência à corrosão"
              },
              {
                material: "Aço",
                coeficiente: "12 × 10⁻⁶ °C⁻¹",
                aplicacoes: ["Construção civil", "Trilhos", "Pontes"],
                caracteristicas: "Alta resistência mecânica"
              },
              {
                material: "Cobre",
                coeficiente: "17 × 10⁻⁶ °C⁻¹",
                aplicacoes: ["Fios elétricos", "Tubulações", "Trocadores de calor"],
                caracteristicas: "Excelente condutor térmico"
              }
            ].map((item, index) => (
              <Card key={index} className="glass-panel">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.material}</h3>
                  <p className="text-primary mb-2">{item.coeficiente}</p>
                  <div className="mb-2">
                    <strong>Aplicações:</strong>
                    <ul className="list-disc list-inside">
                      {item.aplicacoes.map((app, i) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Características:</strong> {item.caracteristicas}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="glass-panel p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FlaskConicalIcon className="text-primary" />
            Aplicações Práticas
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Engenharia Civil</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Juntas de dilatação em pontes e viadutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Estruturas metálicas em edifícios</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Dimensionamento de tubulações</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Indústria</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Calibração de instrumentos de precisão</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Sistemas de refrigeração</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Projeto de máquinas térmicas</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="glass-panel p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <GraduationCapIcon className="text-primary" />
            Prática de Exercícios
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="mb-6">
                Teste seus conhecimentos com nossa série de 90 exercícios sobre dilatação linear. 
                Cada questão foi cuidadosamente elaborada para cobrir diferentes aspectos e aplicações práticas,
                utilizando dados reais de materiais comumente encontrados na engenharia.
              </p>
              <Button 
                onClick={() => navigate("/Questions?tab=linear")}
                className="w-full md:w-auto neon-glow"
                size="lg"
              >
                Começar Exercícios
              </Button>
            </div>
            <div className="glass-panel p-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChartIcon className="text-primary" />
                Tópicos Abordados
              </h3>
              <ul className="space-y-2">
                <li>• Cálculo de variação de comprimento</li>
                <li>• Determinação de coeficientes de dilatação</li>
                <li>• Cálculo de temperatura inicial</li>
                <li>• Cálculo de temperatura final</li>
                <li>• Determinação de variação de temperatura</li>
                <li>• Problemas práticos de engenharia</li>
                <li>• Aplicações em diferentes materiais</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <MultipleChoiceExercise
        open={showExercise}
        onOpenChange={setShowExercise}
        type="linear"
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
      />
    </div>
  );
};

export default LinearExpansion;
