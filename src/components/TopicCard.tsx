import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TopicCardProps {
  title: string;
  description: string;
  imageUrl: string;
  icon?: ReactNode;
  color?: "cyan" | "purple" | "yellow";
  onPractice: () => void;
}

export const TopicCard = ({ 
  title, 
  description, 
  imageUrl, 
  icon, 
  color = "cyan", 
  onPractice 
}: TopicCardProps) => {
  // Configurar classes baseadas na cor
  const colorClasses = {
    cyan: {
      gradient: "from-cyan-500 to-blue-600",
      shadow: "shadow-cyan-500/20 hover:shadow-cyan-500/40",
      border: "border-cyan-500/20",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400"
    },
    purple: {
      gradient: "from-purple-500 to-pink-600",
      shadow: "shadow-purple-500/20 hover:shadow-purple-500/40",
      border: "border-purple-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400"
    },
    yellow: {
      gradient: "from-yellow-500 to-orange-600",
      shadow: "shadow-yellow-500/20 hover:shadow-yellow-500/40",
      border: "border-yellow-500/20",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400"
    }
  };
  
  const classes = colorClasses[color];
  
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.02, 
        transition: { duration: 0.3 } 
      }}
      className="h-full"
    >
      <Card className={`backdrop-blur-md bg-black/30 border ${classes.border} overflow-hidden rounded-xl shadow-lg ${classes.shadow} transition-all duration-300 h-full flex flex-col`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-all duration-700 hover:scale-110" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.svg';
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${classes.gradient} opacity-60`} />
          
          {/* Overlay de vinheta para melhorar contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Título com posicionamento melhorado */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
          </div>
          
          {/* Ícone no canto superior direito */}
          {icon && (
            <motion.div 
              className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full ${classes.iconBg} backdrop-blur-md`}
              animate={{ 
                y: [0, -4, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              {icon}
            </motion.div>
          )}
        </div>
        
        <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
          <p className="mb-4 md:mb-6 text-sm md:text-base text-gray-300/90">{description}</p>
          
          <Button 
            onClick={onPractice} 
            className={`w-full bg-gradient-to-r ${classes.gradient} text-white hover:shadow-md ${classes.shadow} transition-all duration-300 mt-auto min-h-[44px]`}
          >
            Explorar Tópico
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
