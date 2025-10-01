import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Copy, Check, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "hindi", label: "Hindi" },
  { value: "russian", label: "Russian" },
];

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
];

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [outputEmail, setOutputEmail] = useState("");
  const [sourceLang, setSourceLang] = useState("english");
  const [targetLang, setTargetLang] = useState("spanish");
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return;
    }

    if (sourceLang === targetLang) {
      toast({
        title: "Same language",
        description: "Source and target languages must be different",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setOutputEmail("");

    try {
      const { data, error } = await supabase.functions.invoke("translate-email", {
        body: {
          text: inputText,
          sourceLang,
          targetLang,
          tone,
        },
      });

      if (error) throw error;

      setOutputEmail(data.translatedEmail);
      toast({
        title: "Email generated!",
        description: "Your professional email is ready",
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputEmail);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <header className="py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Email Translator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Write in your language, get professional emails in any language. Powered by AI translation
            and intelligent formatting.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-primary" />
                Your Message
              </CardTitle>
              <CardDescription>Write your message in your preferred language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source-lang">From Language</Label>
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger id="source-lang">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-text">Your Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Type or paste your message here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-lang">To Language</Label>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger id="target-lang">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Email Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleTranslate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Generate Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                Professional Email
              </CardTitle>
              <CardDescription>AI-translated and formatted email ready to send</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="output-email">Generated Email</Label>
                <div className="relative">
                  <Textarea
                    id="output-email"
                    value={outputEmail}
                    readOnly
                    placeholder="Your translated email will appear here..."
                    className="min-h-[300px] resize-none bg-muted/30"
                  />
                  {outputEmail && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="absolute top-2 right-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {outputEmail && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Tip:</span> Review the email
                    before sending to ensure it matches your intent.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
