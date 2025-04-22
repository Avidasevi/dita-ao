import { Header } from "@/components/Header";
import { TopicCard } from "@/components/TopicCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { BarChart, Atom, Thermometer, Layers, Ruler, Zap, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Acompanhar posição do mouse para efeitos de parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Animação de scroll para alternar seções ativas
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      const newActiveSection = Math.floor(scrollY / (viewportHeight * 0.7));
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  // Dados de exemplos de cálculos para animação
  const calculationExamples = [
    { material: "Alumínio", coef: "24 × 10⁻⁶ °C⁻¹", temp: "↑ 50°C", result: "↑ 1.2 cm" },
    { material: "Cobre", coef: "17 × 10⁻⁶ °C⁻¹", temp: "↑ 75°C", result: "↑ 1.275 cm" },
    { material: "Aço", coef: "12 × 10⁻⁶ °C⁻¹", temp: "↑ 100°C", result: "↑ 1.2 cm" },
  ];
  
  const [activeExample, setActiveExample] = useState(0);
  
  // Auto-rotação dos exemplos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % calculationExamples.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [calculationExamples.length]);
  
  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Calculate transform offset based on mouse position
  const calcTransform = (factor: number) => {
    if (isMobile) return {};
    
    const { x, y } = mousePosition;
    const winX = window.innerWidth / 2;
    const winY = window.innerHeight / 2;
    const offsetX = ((x - winX) / winX) * factor;
    const offsetY = ((y - winY) / winY) * factor;
    
    return {
      transform: `translate(${offsetX}px, ${offsetY}px)`
    };
  };
  
  return (
    <div className="min-h-screen bg-black font-space-grotesk text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={heroRef}>
        <motion.div 
          className="absolute inset-0 z-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            backgroundSize: '120% 120%',
          }}
        />
        
        {/* Partículas de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-500/20 blur-sm"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4 md:px-6 z-10 relative"
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div 
              variants={fadeInVariants}
              className="flex justify-center mb-6"
            >
              <motion.div
                className="relative"
                animate={{
                  rotateZ: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 border border-cyan-500/30 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-16 h-16 md:w-20 md:h-20 -translate-x-1/2 -translate-y-1/2 border border-purple-500/30 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-12 h-12 md:w-16 md:h-16 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/30 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-8 h-8 md:w-12 md:h-12 -translate-x-1/2 -translate-y-1/2 border border-purple-500/30 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(6,182,212,0.7)]"></div>
                
                <motion.div
                  className="absolute top-0 left-1/2 h-full -ml-0.5" 
                  style={{ width: "1px", backgroundImage: "linear-gradient(to bottom, transparent, #06b6d4, transparent)" }}
                  animate={{
                    rotateZ: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute top-0 left-0 w-2 h-2 -ml-1 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(6,182,212,0.7)]"></div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              variants={fadeInVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 neon-text"
            >
              Estudo Avançado<br/>em <span className="text-purple-400">Dilatação</span> Térmica
            </motion.h1>
            
            <motion.p 
              variants={fadeInVariants}
              className="text-lg md:text-xl text-cyan-50/80 max-w-2xl mx-auto mb-12"
            >
              Explore os conceitos fundamentais da dilatação térmica através de uma experiência interativa e visualmente envolvente
            </motion.p>
            
            <motion.div
              variants={fadeInVariants}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
            >
              <Button
                onClick={() => navigate('/linear')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 px-6 min-h-[44px] sm:min-w-[160px]"
                size="lg"
              >
                Dilatação Linear
              </Button>
              
              <Button
                onClick={() => navigate('/surface')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 px-6 min-h-[44px] sm:min-w-[160px]"
                size="lg"
              >
                Dilatação Superficial
              </Button>
            </motion.div>
            
            <motion.div 
              variants={fadeInVariants}
              style={calcTransform(10)}
              className="backdrop-blur-md bg-black/20 border border-primary/10 rounded-2xl p-4 md:p-6 max-w-lg mx-auto shadow-[0_0_30px_rgba(6,182,212,0.2)] relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                </div>
              </div>
              
              <h3 className="text-lg md:text-xl font-semibold mb-2 relative">Exemplo de Cálculo</h3>
              
              <div className="relative">
                {calculationExamples.map((example, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-2 gap-2 md:gap-4 text-sm md:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: activeExample === index ? 1 : 0,
                      y: activeExample === index ? 0 : 20
                    }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'absolute', width: '100%', display: activeExample === index ? 'grid' : 'none' }}
                  >
                    <div className="p-2 md:p-3 rounded-lg bg-white/5">
                      <div className="text-xs md:text-sm text-cyan-300/80">Material</div>
                      <div>{example.material}</div>
                    </div>
                    <div className="p-2 md:p-3 rounded-lg bg-white/5">
                      <div className="text-xs md:text-sm text-cyan-300/80">Coeficiente</div>
                      <div>{example.coef}</div>
                    </div>
                    <div className="p-2 md:p-3 rounded-lg bg-white/5">
                      <div className="text-xs md:text-sm text-cyan-300/80">Temperatura</div>
                      <div>{example.temp}</div>
                    </div>
                    <div className="p-2 md:p-3 rounded-lg bg-white/5">
                      <div className="text-xs md:text-sm text-cyan-300/80">Resultado</div>
                      <div className="text-purple-400">{example.result}</div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Dummy div to maintain height */}
                <div className="grid grid-cols-2 gap-2 md:gap-4 text-sm md:text-base opacity-0 pointer-events-none">
                  <div className="p-2 md:p-3 rounded-lg">
                    <div className="text-xs md:text-sm">Material</div>
                    <div>Dummy</div>
                  </div>
                  <div className="p-2 md:p-3 rounded-lg">
                    <div className="text-xs md:text-sm">Coeficiente</div>
                    <div>Dummy</div>
                  </div>
                  <div className="p-2 md:p-3 rounded-lg">
                    <div className="text-xs md:text-sm">Temperatura</div>
                    <div>Dummy</div>
                  </div>
                  <div className="p-2 md:p-3 rounded-lg">
                    <div className="text-xs md:text-sm">Resultado</div>
                    <div>Dummy</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                {calculationExamples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveExample(index)}
                    className={`w-2 h-2 rounded-full mx-1 transition-all ${
                      activeExample === index ? 'bg-cyan-400 scale-125' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={fadeInVariants}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block"
          >
            <div className="text-white/70 text-sm font-light">Rolar para baixo</div>
            <div className="w-6 h-6 border-b-2 border-r-2 border-white/50 transform rotate-45 mx-auto mt-2" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Seção de Tópicos de Estudo com Cards Interativos */}
      <section className="py-12 md:py-20 px-4 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 neon-text">Tópicos de Estudo</h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-cyan-50/90">
              Navegue pelos principais conceitos da dilatação térmica em nosso ambiente de aprendizado interativo
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <TopicCard
                title="Dilatação Linear"
                description="Estude como os materiais se expandem em uma dimensão quando submetidos a variações de temperatura, com destaque para coeficientes de dilatação diferentes."
                imageUrl="/assets/linear-expansion.webp"
                onPractice={() => navigate("/linear")}
                icon={<Ruler className="h-5 w-5 md:h-6 md:w-6 text-cyan-400" />}
                color="cyan"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TopicCard
                title="Dilatação Superficial"
                description="Compreenda o comportamento dos materiais quando a expansão térmica ocorre em duas dimensões, visualizando efeitos em placas e superfícies."
                imageUrl="/assets/surface-expansion.webp"
                onPractice={() => navigate("/surface")}
                icon={<Layers className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />}
                color="purple"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Fundo decorativo */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <svg width="100%" height="100%" className="absolute top-0 left-0">
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="none" />
              <circle cx="20" cy="20" r="1" fill="#6366f1" fillOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </section>
      
      {/* Seção de Simulador Animado */}
      <section className="py-12 md:py-16 px-4 relative bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full mb-3 md:mb-4 backdrop-blur-sm">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 neon-text">Simulador de Dilatação</h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-cyan-50/90">
              Visualize exemplos de cálculos e resultados para diferentes materiais e temperaturas
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-4 md:p-8 rounded-xl backdrop-blur-md bg-black/20 border border-purple-500/20 overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            {/* Conteúdo Simulador */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="w-full md:w-1/2">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Dilatação Linear</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-6">
                  A dilatação linear é proporcional à variação de temperatura e ao comprimento inicial do objeto, sendo expressa pela fórmula:
                </p>
                
                <div className="glass-panel p-3 md:p-4 mb-4 md:mb-6 text-center">
                  <div className="text-lg md:text-xl font-mono">
                    ΔL = α × L<sub>0</sub> × ΔT
                  </div>
                </div>
                
                <div className="text-sm md:text-base">
                  <div className="flex justify-between mb-2">
                    <span>ΔL: Variação no comprimento</span>
                    <span className="text-cyan-400">?</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>α: Coeficiente de dilatação</span>
                    <span className="text-purple-400">12 × 10<sup>-6</sup> °C<sup>-1</sup></span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>L<sub>0</sub>: Comprimento inicial</span>
                    <span className="text-cyan-400">2 m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ΔT: Variação de temperatura</span>
                    <span className="text-purple-400">50 °C</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-xs md:max-w-sm aspect-[3/2]">
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-md"
                    animate={{
                      width: ['100%', '105%', '100%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  <div className="absolute top-12 left-0 text-xs md:text-sm text-cyan-400">L<sub>0</sub> = 2m</div>
                  
                  <motion.div 
                    className="absolute top-20 left-0 right-0 flex justify-center"
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded text-xs md:text-sm">
                      ΔL = 0.0012m
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-md"
                    animate={{
                      width: ['100%', '105%', '100%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  <div className="absolute bottom-12 right-0 text-xs md:text-sm text-purple-400">ΔT = 50°C</div>
                </div>
                
                <Button
                  onClick={() => navigate("/linear")} 
                  variant="outline"
                  className="mt-6 md:mt-8 border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/30 min-h-[44px]"
                >
                  Explorar o Simulador
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Seção de Features */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 neon-text">Características do Curso</h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto text-cyan-50/90">
              Descubra os benefícios exclusivos do nosso método de aprendizado
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            <motion.div 
              variants={itemVariants}
              className="backdrop-blur-md bg-black/30 border border-primary/20 rounded-xl p-4 md:p-6 transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 duration-300"
            >
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-700/20 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 md:mb-4">
                <BarChart className="h-6 w-6 md:h-7 md:w-7 text-cyan-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">180 Exercícios Práticos</h3>
              <p className="text-sm md:text-base text-cyan-50/90">Distribuídos entre dilatação linear e superficial, com níveis progressivos de dificuldade e diferentes tipos de problemas.</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="backdrop-blur-md bg-black/30 border border-primary/20 rounded-xl p-4 md:p-6 transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 duration-300"
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 md:mb-4">
                <Thermometer className="h-6 w-6 md:h-7 md:w-7 text-purple-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Simuladores Interativos</h3>
              <p className="text-sm md:text-base text-cyan-50/90">Visualize o processo de dilatação térmica em tempo real através de animações dinâmicas que ilustram os conceitos físicos.</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="backdrop-blur-md bg-black/30 border border-primary/20 rounded-xl p-4 md:p-6 transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 duration-300 sm:col-span-2 md:col-span-1"
            >
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 md:mb-4">
                <Book className="h-6 w-6 md:h-7 md:w-7 text-yellow-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Conteúdo Detalhado</h3>
              <p className="text-sm md:text-base text-cyan-50/90">Estudo aprofundado sobre coeficientes de dilatação, materiais, aplicações práticas e fenômenos térmicos relacionados.</p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 md:mt-12 text-center"
          >
            <Button 
              onClick={() => navigate("/questions")} 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transform hover:scale-105 transition-all min-h-[44px] px-6"
            >
              Começar Agora
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
