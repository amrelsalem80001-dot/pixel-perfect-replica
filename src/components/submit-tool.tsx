import { useState } from "react";
import { Check, Rocket, Clock } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function SubmitToolDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { tr } = useApp();
  const [plan, setPlan] = useState<"free" | "fast">("free");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const plans = [
    { id: "free" as const, icon: Clock, title: tr("قائمة الانتظار المجانية", "Free Waitlist"), price: tr("مجاناً", "Free"), desc: tr("مراجعة خلال 2-4 أسابيع", "Reviewed in 2–4 weeks") },
    { id: "fast" as const, icon: Rocket, title: tr("إدراج سريع مموّل", "Fast-Track Sponsored"), price: "$49", desc: tr("نشر خلال 24 ساعة + شارة «مميز»", "Live in 24h + “Featured” badge") },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tr("أضف أداتك", "Submit your tool")}</DialogTitle>
          <DialogDescription>{tr("انشر أداتك أمام آلاف المهتمين بالذكاء الاصطناعي.", "Put your tool in front of thousands of AI fans.")}</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !/^https?:\/\//.test(url)) { toast.error(tr("أدخل اسماً ورابطاً صحيحاً", "Enter a name and valid URL")); return; }
          toast.success(plan === "fast" ? tr("سيتم التواصل معك لإتمام الدفع", "We'll contact you to complete payment") : tr("أُضيفت أداتك لقائمة الانتظار", "Added to the waitlist"));
          setName(""); setUrl(""); onOpenChange(false);
        }}>
          <Input placeholder={tr("اسم الأداة", "Tool name")} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
          <Input placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} dir="ltr" maxLength={200} />
          <Textarea placeholder={tr("وصف مختصر", "Short description")} maxLength={300} />
          <div className="grid gap-3 sm:grid-cols-2">
            {plans.map((p) => (
              <button type="button" key={p.id} onClick={() => setPlan(p.id)} className={cn("relative rounded-xl border p-4 text-start transition", plan === p.id ? "border-primary bg-accent glow" : "hover:border-primary/40")}>
                {plan === p.id && <Check className="absolute end-3 top-3 size-4 text-primary" />}
                <p.icon className="mb-2 size-5 text-primary" />
                <div className="font-bold">{p.title}</div>
                <div className="text-lg font-black text-primary">{p.price}</div>
                <div className="text-xs text-muted-foreground">{p.desc}</div>
              </button>
            ))}
          </div>
          <Button type="submit" className="w-full">{tr("إرسال", "Submit")}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
