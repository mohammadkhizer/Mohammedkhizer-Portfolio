"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Download,
  Upload,
  DatabaseBackup,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Loader2,
  FileJson,
  RotateCcw,
  Info,
  Database,
  ArrowRightLeft,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RestoreResult = {
  success: boolean;
  totalRestored?: number;
  restoredAt?: string;
  results?: Record<string, { restored: number; error?: string }>;
  error?: string;
};

type TransferResult = {
  success: boolean;
  direction?: "push" | "pull";
  totalTransferred?: number;
  transferredAt?: string;
  results?: Record<string, { transferred: number; error?: string }>;
  error?: string;
};

type TransferDirection = "push" | "pull";
type ActiveTab = "db" | "json";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="flex items-center gap-1 text-emerald-500 font-semibold text-xs">
      <CheckCircle2 className="h-3.5 w-3.5" /> OK
    </span>
  ) : (
    <span className="flex items-center gap-1 text-destructive font-semibold text-xs">
      <XCircle className="h-3.5 w-3.5" /> Error
    </span>
  );
}

const COLLECTIONS = [
  "Projects",
  "Skills",
  "Experience",
  "Education",
  "Certifications",
  "Achievements",
  "Testimonials",
  "User Profile",
  "Project Categories",
  "Contact Submissions",
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BackupPage() {
  // ── Tab state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("db");

  // ── DB Transfer state ──────────────────────────────────────────────────────
  const [targetUri, setTargetUri] = React.useState("");
  const [showUri, setShowUri] = React.useState(false);
  const [direction, setDirection] = React.useState<TransferDirection>("push");
  const [transferring, setTransferring] = React.useState(false);
  const [transferResult, setTransferResult] =
    React.useState<TransferResult | null>(null);

  // ── JSON Export state ──────────────────────────────────────────────────────
  const [exporting, setExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);
  const [lastExported, setLastExported] = React.useState<string | null>(null);

  // ── JSON Restore state ─────────────────────────────────────────────────────
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [restoring, setRestoring] = React.useState(false);
  const [restoreResult, setRestoreResult] =
    React.useState<RestoreResult | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ── DB Transfer Handler ────────────────────────────────────────────────────

  const handleTransfer = async () => {
    if (!targetUri.trim()) return;
    setTransferring(true);
    setTransferResult(null);

    try {
      const res = await fetch("/api/v1/backup/db-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUri: targetUri.trim(), direction }),
      });

      const data: TransferResult = await res.json();
      setTransferResult(data);
    } catch (err: any) {
      setTransferResult({
        success: false,
        error: err.message || "Transfer request failed.",
      });
    } finally {
      setTransferring(false);
    }
  };

  // ── JSON Export Handler ────────────────────────────────────────────────────

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const res = await fetch("/api/v1/backup/export");
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Export failed" }));
        throw new Error(err.error || "Export failed");
      }

      const blob = await res.blob();
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `portfolio-backup-${dateStr}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setLastExported(new Date().toLocaleString());
    } catch (err: any) {
      setExportError(err.message || "Unknown error");
    } finally {
      setExporting(false);
    }
  };

  // ── JSON Restore Handlers ──────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setRestoreResult(null);
  };

  const handleRestore = async () => {
    if (!selectedFile) return;
    setRestoring(true);
    setRestoreResult(null);

    try {
      const text = await selectedFile.text();
      const payload = JSON.parse(text);

      const res = await fetch("/api/v1/backup/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: RestoreResult = await res.json();
      setRestoreResult(data);
    } catch (err: any) {
      setRestoreResult({
        success: false,
        error: err.message || "Failed to parse or upload backup file.",
      });
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFile(null);
    }
  };

  // ─── Confirmation dialog label helpers ───────────────────────────────────

  const directionLabel =
    direction === "push"
      ? "Current DB → Target DB"
      : "Target DB → Current DB";

  const directionWarning =
    direction === "push"
      ? "All matching collections in the target database will be permanently overwritten."
      : "All matching collections in the current database will be permanently overwritten.";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <DatabaseBackup className="h-8 w-8 text-primary" />
          Backup &amp; Restore
        </h1>
        <p className="text-muted-foreground mt-2">
          Transfer your portfolio data directly between databases, or export /
          import via JSON file.
        </p>
      </div>

      {/* ── Tab Switcher ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1 w-fit border border-border/50">
        <button
          id="tab-db-transfer"
          onClick={() => setActiveTab("db")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === "db"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Database className="h-4 w-4" />
          Database Transfer
          <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            Primary
          </span>
        </button>
        <button
          id="tab-json-backup"
          onClick={() => setActiveTab("json")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === "json"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileJson className="h-4 w-4" />
          JSON File
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DB TRANSFER TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "db" && (
        <div className="space-y-6">
          <Card className="border-primary/15">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                Database-to-Database Transfer
              </CardTitle>
              <CardDescription>
                Copy all portfolio collections directly between two MongoDB
                databases without downloading a file.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Direction selector */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Transfer Direction
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Push */}
                  <button
                    id="direction-push-btn"
                    onClick={() => setDirection("push")}
                    className={`flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      direction === "push"
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/30 hover:bg-secondary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowRight
                        className={`h-4 w-4 ${
                          direction === "push"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="font-bold text-sm">
                        Push to Target
                      </span>
                      {direction === "push" && (
                        <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Copy <strong className="text-foreground">current DB</strong>{" "}
                      → target URI. Use this to back up or replicate data to
                      another cluster.
                    </p>
                  </button>

                  {/* Pull */}
                  <button
                    id="direction-pull-btn"
                    onClick={() => setDirection("pull")}
                    className={`flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      direction === "pull"
                        ? "border-amber-500 bg-amber-500/5"
                        : "border-border/50 hover:border-amber-500/30 hover:bg-secondary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowLeft
                        className={`h-4 w-4 ${
                          direction === "pull"
                            ? "text-amber-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="font-bold text-sm">Pull from Target</span>
                      {direction === "pull" && (
                        <CheckCircle2 className="h-4 w-4 text-amber-500 ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Copy target URI →{" "}
                      <strong className="text-foreground">current DB</strong>. Use
                      this to restore from a remote backup cluster.
                    </p>
                  </button>
                </div>
              </div>

              {/* Target URI input */}
              <div className="space-y-2">
                <label
                  htmlFor="target-uri-input"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  Target MongoDB URI
                </label>
                <div className="relative">
                  <Input
                    id="target-uri-input"
                    type={showUri ? "text" : "password"}
                    placeholder="mongodb+srv://user:password@cluster.mongodb.net/dbname"
                    value={targetUri}
                    onChange={(e) => setTargetUri(e.target.value)}
                    className="pr-10 font-mono text-xs h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUri(!showUri)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showUri ? "Hide URI" : "Show URI"}
                  >
                    {showUri ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3 shrink-0" />
                  The URI is used only for this request and is never stored.
                </p>
              </div>

              {/* Collections included */}
              <div className="rounded-xl bg-secondary/40 border border-border/50 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Collections Included
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {COLLECTIONS.map((col) => (
                    <div
                      key={col}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      {col}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transfer result */}
              {transferResult && (
                <div
                  className={`rounded-xl border p-4 text-xs space-y-3 ${
                    transferResult.success
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-destructive/10 border-destructive/20"
                  }`}
                >
                  {transferResult.success ? (
                    <>
                      <div className="flex items-center gap-2 font-bold text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Transfer complete —{" "}
                        {transferResult.totalTransferred} records transferred (
                        {transferResult.direction === "push"
                          ? "Current → Target"
                          : "Target → Current"}
                        )
                      </div>
                      {transferResult.results && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-emerald-500/20">
                          {Object.entries(transferResult.results).map(
                            ([key, val]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="text-muted-foreground capitalize truncate">
                                  {key}
                                </span>
                                {val.error ? (
                                  <StatusBadge ok={false} />
                                ) : (
                                  <span className="text-emerald-600 font-bold">
                                    {val.transferred}
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-start gap-2 text-destructive font-medium">
                      <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      {transferResult.error || "Transfer failed"}
                    </div>
                  )}
                </div>
              )}

              {/* Transfer button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    id="db-transfer-btn"
                    disabled={!targetUri.trim() || transferring}
                    className={`w-full h-12 gap-2 font-bold ${
                      direction === "pull"
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : ""
                    }`}
                    variant={direction === "pull" ? "outline" : "default"}
                  >
                    {transferring ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                        Transferring…
                      </>
                    ) : direction === "push" ? (
                      <>
                        <ArrowRight className="h-4 w-4" /> Push to Target DB
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="h-4 w-4" /> Pull from Target DB
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                      Confirm Database Transfer
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2 leading-relaxed">
                      <span className="block">
                        Direction:{" "}
                        <strong className="text-foreground">
                          {directionLabel}
                        </strong>
                      </span>
                      <span className="block text-destructive font-semibold">
                        {directionWarning}
                      </span>
                      <span className="block">
                        This action cannot be undone. Are you absolutely sure?
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground text-xs mt-1">
                        <Info className="h-3 w-3 shrink-0" />
                        Your admin account credentials are never transferred or
                        affected.
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleTransfer}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Transfer Now
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          JSON FILE TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "json" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Export Card ─────────────────────────────────────────────────── */}
          <Card className="border-primary/10 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="h-5 w-5 text-primary" />
                Export Backup
              </CardTitle>
              <CardDescription>
                Download a complete snapshot of all your portfolio data as a{" "}
                <code className="text-xs bg-secondary px-1 rounded">.json</code>{" "}
                file.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 flex-1">
              {/* Collections list */}
              <div className="rounded-xl bg-secondary/40 border border-border/50 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Included Collections
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {COLLECTIONS.map((col) => (
                    <div
                      key={col}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      {col}
                    </div>
                  ))}
                </div>
              </div>

              {/* Export feedback */}
              {exportError && (
                <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  {exportError}
                </div>
              )}
              {lastExported && !exportError && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Last exported: {lastExported}
                </div>
              )}

              {/* Export button */}
              <Button
                id="export-backup-btn"
                onClick={handleExport}
                disabled={exporting}
                className="w-full h-12 mt-auto gap-2 font-bold"
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Preparing…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Download Backup
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ── Restore Card ────────────────────────────────────────────────── */}
          <Card className="border-destructive/20 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-destructive" />
                Restore from Backup
              </CardTitle>
              <CardDescription>
                Upload a previously exported{" "}
                <code className="text-xs bg-secondary px-1 rounded">.json</code>{" "}
                file to replace all current data.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 flex-1">
              {/* Warning banner */}
              <div className="flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4">
                <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-xs text-destructive leading-relaxed">
                  <p className="font-bold mb-1">Destructive operation</p>
                  <p>
                    All existing collection data will be permanently deleted
                    before the backup is restored. This cannot be undone. Your
                    admin login credentials are never affected.
                  </p>
                </div>
              </div>

              {/* File drop zone */}
              <label
                htmlFor="backup-file-input"
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors ${
                  selectedFile
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/40 hover:bg-secondary/30"
                }`}
              >
                <FileJson
                  className={`h-10 w-10 ${
                    selectedFile ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-primary truncate max-w-[180px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-semibold">
                      Click to select backup file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Only <code>.json</code> files exported from this system
                    </p>
                  </div>
                )}
                <input
                  id="backup-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Restore result */}
              {restoreResult && (
                <div
                  className={`rounded-xl border p-4 text-xs space-y-3 ${
                    restoreResult.success
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-destructive/10 border-destructive/20"
                  }`}
                >
                  {restoreResult.success ? (
                    <>
                      <div className="flex items-center gap-2 font-bold text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Restore complete — {restoreResult.totalRestored} records
                        restored
                      </div>
                      {restoreResult.results && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-emerald-500/20">
                          {Object.entries(restoreResult.results).map(
                            ([key, val]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="text-muted-foreground capitalize truncate">
                                  {key}
                                </span>
                                {val.error ? (
                                  <StatusBadge ok={false} />
                                ) : (
                                  <span className="text-emerald-600 font-bold">
                                    {val.restored}
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-start gap-2 text-destructive font-medium">
                      <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      {restoreResult.error || "Restore failed"}
                    </div>
                  )}
                </div>
              )}

              {/* Restore button with confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    id="restore-backup-btn"
                    variant="destructive"
                    disabled={!selectedFile || restoring}
                    className="w-full h-12 mt-auto gap-2 font-bold"
                  >
                    {restoring ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Restoring…
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4" /> Restore Database
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                      Confirm Database Restore
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2 leading-relaxed">
                      <span className="block">
                        You are about to{" "}
                        <strong>permanently delete</strong> all current portfolio
                        data and replace it with the contents of:
                      </span>
                      <span className="block font-bold text-foreground bg-secondary px-3 py-2 rounded-lg text-sm truncate">
                        {selectedFile?.name}
                      </span>
                      <span className="block text-destructive font-semibold">
                        This action cannot be undone. Are you absolutely sure?
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground text-xs mt-1">
                        <Info className="h-3 w-3 shrink-0" />
                        Your admin account will not be affected.
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRestore}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Restore Now
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info footer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Best practice:</strong> Use
          Database Transfer to replicate data between your staging and production
          clusters. Use JSON export as an offline safety archive before making
          large structural changes. Backups never include passwords or admin
          credentials.
        </p>
      </div>
    </div>
  );
}
