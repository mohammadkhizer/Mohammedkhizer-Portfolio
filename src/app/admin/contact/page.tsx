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
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ContactManagement() {
  const firestore = useFirestore();
  const contactRef = useMemoFirebase(() => collection(firestore, "contactSubmissions"), [firestore]);
  const { data: submissions, isLoading } = useCollection(contactRef);

  const sortedSubmissions = React.useMemo(() => {
    if (!submissions) return [];
    return [...submissions].sort((a, b) => 
      new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );
  }, [submissions]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      deleteDocumentNonBlocking(doc(firestore, "contactSubmissions", id));
    }
  };

  const toggleReadStatus = (submission: any) => {
    updateDocumentNonBlocking(doc(firestore, "contactSubmissions", submission.id), {
      isRead: !submission.isRead
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visitor Inquiries</h1>
        <p className="text-muted-foreground">Manage messages sent through your portfolio contact form.</p>
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
                "transition-all duration-300 border-primary/10 overflow-hidden",
                !sub.isRead ? "border-l-4 border-l-primary bg-primary/5 shadow-md" : "opacity-80"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-full shrink-0",
                      !sub.isRead ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                    )}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{sub.subject}</CardTitle>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {sub.senderName} ({sub.senderEmail})
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> 
                          {format(new Date(sub.submissionDate), "MMM d, yyyy • h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleReadStatus(sub)}
                      className={cn(
                        "h-9 px-3 gap-2 rounded-full font-bold text-[10px] uppercase tracking-widest",
                        !sub.isRead ? "text-primary hover:bg-primary/10" : "text-muted-foreground"
                      )}
                    >
                      {sub.isRead ? (
                        <>
                          <Circle className="h-3.5 w-3.5" /> Mark Unread
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
                      onClick={() => handleDelete(sub.id)}
                      className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-5 bg-background/50 rounded-2xl border border-border/50">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-1" />
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
              <p className="text-xl font-bold">No Inquiries Found</p>
              <p className="text-muted-foreground italic">When visitors contact you, their messages will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
