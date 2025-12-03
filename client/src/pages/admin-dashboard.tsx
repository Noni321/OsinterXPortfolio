
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  LogOut,
  FileText,
  Clock,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    readTime: "",
    published: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/articles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch articles", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const url = editingId ? `/api/articles/${editingId}` : "/api/articles";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ 
          title: "Success", 
          description: editingId ? "Article updated" : "Article created" 
        });
        setShowForm(false);
        setEditingId(null);
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          category: "",
          readTime: "",
          published: false,
        });
        fetchArticles();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save article", variant: "destructive" });
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      readTime: article.readTime,
      published: article.published,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({ title: "Success", description: "Article deleted" });
        fetchArticles();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete article", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-cyber-black text-foreground">
      <div className="absolute inset-0 grid-overlay opacity-20" />
      
      <nav className="relative z-10 bg-cyber-dark/90 border-b border-neon/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-neon" />
            <h1 className="text-xl font-mono font-bold text-neon">Osinter x Admin</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="font-mono border-neon/30 text-neon hover:bg-neon/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-mono font-bold text-foreground">
            Article Management
          </h2>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                title: "",
                excerpt: "",
                content: "",
                category: "",
                readTime: "",
                published: false,
              });
            }}
            className="font-mono bg-neon/10 border border-neon text-neon hover:bg-neon/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cyber-gray/50 border border-neon/30 rounded-md p-6 mb-8"
          >
            <h3 className="text-lg font-mono font-bold text-neon mb-4">
              {editingId ? "Edit Article" : "Create New Article"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-muted-foreground mb-2 block">
                    TITLE
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-cyber-dark/50 border-neon/30 font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground mb-2 block">
                    CATEGORY
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="bg-cyber-dark/50 border-neon/30 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground mb-2 block">
                  READ TIME (e.g., "8 min read")
                </label>
                <Input
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  required
                  className="bg-cyber-dark/50 border-neon/30 font-mono"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground mb-2 block">
                  EXCERPT
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  rows={2}
                  className="bg-cyber-dark/50 border-neon/30 font-mono resize-none"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground mb-2 block">
                  CONTENT
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={8}
                  className="bg-cyber-dark/50 border-neon/30 font-mono resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded border-neon/30"
                />
                <label className="font-mono text-sm text-muted-foreground">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="font-mono bg-neon/10 border border-neon text-neon hover:bg-neon/20"
                >
                  {editingId ? "Update Article" : "Create Article"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="font-mono border-neon/30 text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-cyber-gray/40 border border-neon/20 rounded-md p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-mono font-semibold text-foreground">
                      {article.title}
                    </h3>
                    {article.published ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-neon/20 text-neon rounded font-mono text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-mono text-xs">
                        <Clock className="w-3 h-3" />
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground/70">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(article)}
                    className="font-mono border-neon/30 text-neon hover:bg-neon/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(article.id)}
                    className="font-mono border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
