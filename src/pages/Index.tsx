import { Button } from "@/components/ui/button";
import { Code2, Sparkles, Terminal } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background animate-gradient" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[128px] animate-glow" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-4xl text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-card border border-primary/50 rounded-full p-6">
                <Terminal className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Your first Lovable app</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
                Hello World
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to the beginning of something amazing. Every great journey starts with a simple greeting.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 shadow-lg shadow-primary/50 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Get Started
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              <Code2 className="w-5 h-5 mr-2" />
              View Code
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center pt-12">
            {['React', 'TypeScript', 'Tailwind CSS', 'Vite'].map((tech) => (
              <div 
                key={tech}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm text-foreground hover:border-primary/50 transition-colors cursor-default"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default Index;
