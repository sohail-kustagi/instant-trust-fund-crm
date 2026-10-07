import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_TASKS } from "@/lib/demo-data";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Plus,
  User,
  Tag,
  Check,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/admin/tasks")({
  head: () => ({ meta: [{ title: "Operations Task Manager — IFY CRM" }] }),
  component: AdminTasks,
});

function AdminTasks() {
  const [filter, setFilter] = useState<string>("All");
  const [tasks, setTasks] = useState(DEMO_TASKS);

  const { data } = useQuery({
    queryKey: ["admin-tasks"],
    queryFn: () => fetchAPI("/tasks"),
    initialData: { tasks: DEMO_TASKS },
  });

  const allTasks: any[] = tasks.length > 0 ? tasks : (data?.tasks || DEMO_TASKS);

  const filteredTasks =
    filter === "All"
      ? allTasks
      : filter === "Urgent"
        ? allTasks.filter((t: any) => t.priority === "Urgent")
        : allTasks.filter((t: any) => t.status === filter);

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t: any) => {
        if (t.id === taskId) {
          const nextStatus = t.status === "Completed" ? "Pending" : "Completed";
          toast.success(
            nextStatus === "Completed" ? "Task marked as completed" : "Task reopened",
          );
          return { ...t, status: nextStatus };
        }
        return t;
      }),
    );
  };

  const urgentCount = allTasks.filter((t: any) => t.priority === "Urgent").length;
  const inProgressCount = allTasks.filter((t: any) => t.status === "In Progress").length;
  const completedCount = allTasks.filter((t: any) => t.status === "Completed").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-brand-navy">Operations & Verification Tasks</h1>
            <Badge className="bg-primary/10 text-primary font-semibold">
              Live Queue
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage daily document verification, KGIS land survey checks, and bank coordination.
          </p>
        </div>

        <Button
          onClick={() => toast.info("Task creation dialog opened (Demo Mode)")}
          className="bg-primary hover:bg-brand-navy flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create New Task
        </Button>
      </div>

      {/* Task Summary Metrics */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <Card className="p-4 border shadow-sm">
          <span className="text-xs uppercase font-bold text-muted-foreground">Total In Queue</span>
          <div className="text-2xl font-black mt-1 text-brand-navy">{allTasks.length}</div>
        </Card>
        <Card className="p-4 border shadow-sm border-rose-200 bg-rose-50/30">
          <span className="text-xs uppercase font-bold text-rose-600">Urgent Attention</span>
          <div className="text-2xl font-black mt-1 text-rose-600">{urgentCount}</div>
        </Card>
        <Card className="p-4 border shadow-sm border-amber-200 bg-amber-50/30">
          <span className="text-xs uppercase font-bold text-amber-700">In Progress</span>
          <div className="text-2xl font-black mt-1 text-amber-700">{inProgressCount}</div>
        </Card>
        <Card className="p-4 border shadow-sm border-emerald-200 bg-emerald-50/30">
          <span className="text-xs uppercase font-bold text-emerald-600">Completed Today</span>
          <div className="text-2xl font-black mt-1 text-emerald-600">{completedCount}</div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b mb-6">
        {["All", "Urgent", "Pending", "In Progress", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === tab
                ? "bg-brand-navy text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="p-10 text-center border-dashed">
            <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No tasks in this view</p>
          </Card>
        ) : (
          filteredTasks.map((task: any) => {
            const isCompleted = task.status === "Completed";
            return (
              <Card
                key={task.id}
                className={`p-5 border transition hover:shadow-md ${
                  isCompleted ? "bg-slate-50 opacity-75" : "bg-card"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`mt-1 h-5 w-5 rounded border flex items-center justify-center transition ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-primary"
                      }`}
                    >
                      {isCompleted && <Check className="h-3.5 w-3.5" />}
                    </button>

                    <div>
                      <h3
                        className={`text-base font-bold text-brand-navy ${
                          isCompleted ? "line-through text-slate-400" : ""
                        }`}
                      >
                        {task.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <User className="h-3.5 w-3.5 text-primary" />
                          {task.customer}
                        </span>

                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                          <Tag className="h-3 w-3" />
                          {task.category}
                        </span>

                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          Due: {task.due}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        task.priority === "Urgent"
                          ? "border-rose-300 text-rose-600 bg-rose-50"
                          : task.priority === "High"
                            ? "border-amber-300 text-amber-600 bg-amber-50"
                            : "border-slate-300 text-slate-600"
                      }`}
                    >
                      {task.priority} Priority
                    </Badge>

                    <Badge
                      className={`text-xs font-semibold ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : task.status === "In Progress"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
