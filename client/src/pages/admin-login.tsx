
import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Terminal, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast({ title: "Access Granted", description: "Welcome to the admin panel" });
        setLocation("/admin/dashboard");
      } else {
        toast({ 
          title: "Access Denied", 
          description: data.message,
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Connection Error", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-cyber-gray/50 border border-neon/30 rounded-md overflow-hidden backdrop-blur-sm shadow-neon-sm">
          <div className="bg-cyber-dark/80 border-b border-neon/20 px-4 py-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-neon" />
            <span className="font-mono text-sm text-neon">admin_access.sh</span>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-mono font-bold text-neon text-glow mb-2">
                Osinter x
              </h1>
              <p className="font-mono text-sm text-muted-foreground">
                Admin Panel Access
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-xs text-muted-foreground mb-2 block">
                  <User className="w-3 h-3 inline mr-2" />
                  USERNAME
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="bg-cyber-dark/50 border-neon/30 font-mono text-sm focus:border-neon focus:ring-neon"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground mb-2 block">
                  <Lock className="w-3 h-3 inline mr-2" />
                  PASSWORD
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-cyber-dark/50 border-neon/30 font-mono text-sm focus:border-neon focus:ring-neon"
                  placeholder="Enter password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-mono bg-neon/10 border border-neon text-neon hover:bg-neon/20"
              >
                {isLoading ? "Authenticating..." : "Access System"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
