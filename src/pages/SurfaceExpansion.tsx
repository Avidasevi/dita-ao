import { Header } from "@/components/Header";
import { ThermometerIcon, BookOpenIcon, FlaskConicalIcon, GraduationCapIcon, SquareIcon, BarChartIcon } from "lucide-react";
import { useState } from "react";
import { MultipleChoiceExercise } from "@/components/MultipleChoiceExercise";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const SurfaceExpansion = () => {
  const [showExercise, setShowExercise] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="glass-panel p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dilatação Superficial
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ThermometerIcon className="text-primary" />
                Conceito Fundamental
              </h2>
              <p className="mb-4">
                A dilatação superficial ocorre quando um material expande-se em duas dimensões devido a uma variação de temperatura.
                Este fenômeno é descrito pela equação:
              </p>
              <div className="glass-panel p-4 neon-glow mb-4">
                <p className="text-lg font-bold text-center">ΔA = A₀ · β · ΔT</p>
                <div className="text-sm mt-2 space-y-1">
                  <p>Onde:</p>
                  <p>ΔA = Variação na área</p>
                  <p>A₀ = Área inicial</p>
                  <p>β = Coeficiente de dilatação superficial</p>
                  <p>ΔT = Variação de temperatura</p>
                  <p className="mt-2 font-bold">β = 2α</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <SquareIcon className="text-primary" />
                Características Importantes
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>O coeficiente β é aproximadamente o dobro do coeficiente linear</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>A dilatação ocorre proporcionalmente em duas direções</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Importante em projetos de placas e revestimentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Considerada em materiais como chapas e lâminas</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpenIcon className="text-primary" />
            Coeficientes de Dilatação Superficial (β)
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                material: "Alumínio",
                coeficiente: "48 × 10⁻⁶ °C⁻¹",
                aplicacoes: ["Painéis solares", "Revestimentos", "Chapas"],
                caracteristicas: "Excelente condutividade térmica"
              },
              {
                material: "Aço",
                coeficiente: "24 × 10⁻⁶ °C⁻¹",
                aplicacoes: ["Estruturas metálicas", "Coberturas", "Tanques"],
                caracteristicas: "Alta resistência estrutural"
              },
              {
                material: "Vidro",
                coeficiente: "16 × 10⁻⁶ °C⁻¹",
                aplicacoes: ["Janelas", "Painéis", "Vitrines"],
                caracteristicas: "Baixa expansão térmica"
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
              <h3 className="text-xl font-bold">Construção Civil</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Revestimentos de fachadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Instalação de vidros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Coberturas metálicas</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Tecnologia</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Painéis solares fotovoltaicos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Placas de circuito impresso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Telas de dispositivos</span>
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
                Teste seus conhecimentos com nossa série de 90 exercícios sobre dilatação superficial. 
                Cada questão foi cuidadosamente elaborada para cobrir diferentes aspectos e aplicações práticas,
                utilizando dados reais de materiais comumente encontrados na engenharia.
              </p>
              <Button 
                onClick={() => navigate("/Questions?tab=surface")}
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
                <li>• Cálculo de variação de área</li>
                <li>• Determinação de coeficientes superficiais</li>
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
        type="surface"
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
      />
    </div>
  );
};

export default SurfaceExpansion;
