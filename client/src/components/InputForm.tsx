import { useState } from "react";
import { Calendar, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface InputFormProps {
  onGenerate: (name: string, dob: Date) => void;
  isLoading?: boolean;
}

export function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob) {
      onGenerate(name, new Date(dob));
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:flex-row md:items-end md:gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground">
              Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                data-testid="input-name"
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <Label htmlFor="dob" className="text-xs uppercase tracking-wide text-muted-foreground">
              Date of Birth
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="pl-10"
                data-testid="input-dob"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!name || !dob || isLoading}
            className="md:min-w-[200px]"
            data-testid="button-generate"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
