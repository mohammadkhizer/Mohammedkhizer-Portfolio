"use client";

import * as React from "react";
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Mail, 
  Loader2, 
  Inbox, 
  Calendar, 
  User, 
  CheckCircle2, 
  Circle,
  MessageSquare,
  AlertCircle,
  X,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function ContactManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  
  const contactRef = useMemoFirebase(() => firestore ? collection(firestore, "contactSubmissions") : null, [firestore]);
  const { data: submissions, isLoading } = useCollection(contactRef);

  const sortedSubmissions = React.useMemo(() => {
    if (!submissions) return [];
    return [...submissions].sort((a, b) => 
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
  }, [submissions]);

  const confirmDelete = (id: string) => {
    if (!id) return;
    deleteDocumentNonBlocking(doc(firestore, "contactSubmissions", id));
    setDeletingId(null);
    toast({
      title: "Inquiry Deleted",
      description: "The message has been permanently removed.",
    });
  };

  const toggleReadStatus = (submission: any) => {
    updateDocumentNonBlocking(doc(firestore, "contactSubmissions", submission.id), {
      isRead: !submission.isRead
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitor Inquiries</h1>
          <p className="text-muted-foreground">Manage messages sent through your portfolio contact form.</p>
        </div>
        {!isLoading && sortedSubmissions.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              {sortedSubmissions.filter(s => !s.isRead).length} New Messages
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : sortedSubmissions && sortedSubmissions.length > 0 ? (
          sortedSubmissions.map((sub) => (
            <Card 
              key={sub.id} 
              className={cn(
                "transition-all duration-300 border-primary/10 overflow-hidden shadow-sm hover:shadow-md",
                !sub.isRead ? "border-l-4 border-l-primary bg-primary/5" : "bg-card/50 opacity-90"
              )}
            >
              <CardHeader className="pb-3 px-6 pt-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl shrink-0 transition-colors",
                      !sub.isRead ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground"
                    )}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg font-bold truncate pr-4">{sub.subject}</CardTitle>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-primary/60" /> 
                          <span className="font-bold text-foreground/80">{sub.senderName}</span>
                          <span className="hidden sm:inline">({sub.senderEmail})</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary/60" /> 
                          {format(new Date(sub.submissionDate), "MMM d, yyyy • h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end md:self-start">
                    {deletingId === sub.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => confirmDelete(sub.id)}
                          className="h-9 px-4 gap-2 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-destructive/20"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" /> Confirm Delete
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setDeletingId(null)}
                          className="h-9 w-9 rounded-xl border-primary/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleReadStatus(sub)}
                          className={cn(
                            "h-9 px-4 gap-2 rounded-xl font-bold text-[10px] uppercase tracking-widest border-primary/20",
                            !sub.isRead ? "bg-primary text-white hover:bg-primary/90 border-none shadow-sm" : "text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          {sub.isRead ? (
                            <>
                              <Circle className="h-3.5 w-3.5" /> Unread
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Read
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setDeletingId(sub.id)}
                          className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all"
                          aria-label="Delete inquiry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-2">
                <div className="p-5 bg-background/40 rounded-2xl border border-border/50 group/msg">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-1 opacity-60 group-hover/msg:opacity-100 transition-opacity" />
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 italic">
                      "{sub.message}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-32 border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center justify-center space-y-4">
            <div className="p-6 bg-primary/10 rounded-full">
              <Inbox className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">Inbox Empty</p>
              <p className="text-muted-foreground italic">Messages from your portfolio contact form will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
