import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  CheckpointCreatePayload,
  createCheckpoint,
  createTask,
  fetchDefaultProject,
  fetchLatestCheckpoint,
  fetchTasks,
  Project,
  ProjectCheckpoint,
  ProjectTask,
} from "../../lib/api";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  ListTodo,
  Plus,
  RefreshCw,
  Save,
  Target,
} from "lucide-react";

const emptyCheckpoint: CheckpointCreatePayload = {
  title: "",
  summary: "",
  completed_work: "",
  current_problem: "",
  decisions_made: "",
  next_action: "",
  user_focus_state: "",
  confidence: null,
};

function formatDate(value: string | null | undefined): string {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ProjectsPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [latestCheckpoint, setLatestCheckpoint] = useState<ProjectCheckpoint | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [checkpointForm, setCheckpointForm] = useState<CheckpointCreatePayload>(emptyCheckpoint);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [savingCheckpoint, setSavingCheckpoint] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadProjectMemory = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const activeProject = await fetchDefaultProject();
      const [checkpointResponse, projectTasks] = await Promise.all([
        fetchLatestCheckpoint(activeProject.id),
        fetchTasks(activeProject.id),
      ]);
      setProject(activeProject);
      setLatestCheckpoint(checkpointResponse.checkpoint);
      setTasks(projectTasks);
    } catch (loadError) {
      console.error("Failed to load project memory:", loadError);
      setError("Could not load the active project. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjectMemory();
  }, [loadProjectMemory]);

  const handleCheckpointChange = (
    field: keyof CheckpointCreatePayload,
    value: string,
  ) => {
    setCheckpointForm((current) => ({
      ...current,
      [field]: field === "confidence" ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSaveCheckpoint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!project || !checkpointForm.title.trim() || !checkpointForm.summary.trim()) return;

    setSavingCheckpoint(true);
    setError(null);
    setNotice(null);
    try {
      const checkpoint = await createCheckpoint(project.id, {
        ...checkpointForm,
        title: checkpointForm.title.trim(),
        summary: checkpointForm.summary.trim(),
      });
      setLatestCheckpoint(checkpoint);
      setCheckpointForm(emptyCheckpoint);
      setNotice("Checkpoint saved to project memory.");
    } catch (saveError) {
      console.error("Failed to save checkpoint:", saveError);
      setError("Could not save the checkpoint. Please try again.");
    } finally {
      setSavingCheckpoint(false);
    }
  };

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!project || !taskTitle.trim()) return;

    setSavingTask(true);
    setError(null);
    setNotice(null);
    try {
      const task = await createTask(project.id, {
        title: taskTitle.trim(),
        description: taskDescription.trim() || null,
        priority: taskPriority,
      });
      setTasks((current) => [task, ...current]);
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("medium");
      setNotice("Task added to the active project.");
    } catch (taskError) {
      console.error("Failed to create task:", taskError);
      setError("Could not create the task. Please try again.");
    } finally {
      setSavingTask(false);
    }
  };

  if (loading) {
    return (
      <div className="view-container projects-page">
        <div className="page-loading"><RefreshCw size={18} className="spin" /> Loading project memory…</div>
      </div>
    );
  }

  return (
    <div className="view-container projects-page">
      <div className="section-header projects-header">
        <div>
          <h2>Projects</h2>
          <p>Capture where you are, what changed, and what to do next.</p>
        </div>
        <button className="secondary-button" type="button" onClick={loadProjectMemory} disabled={loading}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {error && (
        <div className="inline-feedback error-feedback" role="alert">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {notice && (
        <div className="inline-feedback success-feedback" role="status">
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {project ? (
        <>
          <section className="project-summary-grid">
            <div className="content-card project-active-card">
              <div className="card-eyebrow"><Target size={14} /> Active Project</div>
              <div className="project-card-title-row">
                <h3>{project.name}</h3>
                <span className="badge">{project.status.toUpperCase()}</span>
              </div>
              <p>{project.description || "No project description yet."}</p>
              <div className="project-meta-grid">
                <div><span>Milestone</span><strong>{project.current_milestone || "Not set"}</strong></div>
                <div><span>Focus</span><strong>{project.current_focus || "Not set"}</strong></div>
                <div><span>Next step</span><strong>{project.next_step || "Not set"}</strong></div>
                <div><span>Priority</span><strong>{project.priority}</strong></div>
              </div>
            </div>

            <div className="content-card checkpoint-latest-card">
              <div className="card-eyebrow"><ClipboardCheck size={14} /> Latest Checkpoint</div>
              {latestCheckpoint ? (
                <>
                  <h3>{latestCheckpoint.title}</h3>
                  <p>{latestCheckpoint.summary}</p>
                  <div className="checkpoint-detail">
                    <span>Saved {formatDate(latestCheckpoint.created_at)}</span>
                    {latestCheckpoint.next_action && <strong>Next: {latestCheckpoint.next_action}</strong>}
                  </div>
                </>
              ) : (
                <div className="empty-card-state">
                  <p>No checkpoint saved yet.</p>
                  <span>Use the form below to record your current stopping point.</span>
                </div>
              )}
            </div>
          </section>

          <section className="projects-work-grid">
            <form className="content-card project-form" onSubmit={handleSaveCheckpoint}>
              <div className="card-heading-row">
                <div>
                  <div className="card-eyebrow"><Save size={14} /> Project Memory</div>
                  <h3>Save Checkpoint</h3>
                </div>
              </div>
              <p className="form-help">Record enough context to resume this project later.</p>

              <label>Checkpoint title<input value={checkpointForm.title} onChange={(event) => handleCheckpointChange("title", event.target.value)} placeholder="e.g. Completed API integration" required /></label>
              <label>Summary<textarea value={checkpointForm.summary} onChange={(event) => handleCheckpointChange("summary", event.target.value)} placeholder="What is the current state of the project?" rows={3} required /></label>
              <div className="form-two-column">
                <label>Completed work<textarea value={checkpointForm.completed_work || ""} onChange={(event) => handleCheckpointChange("completed_work", event.target.value)} placeholder="What changed?" rows={3} /></label>
                <label>Current problem<textarea value={checkpointForm.current_problem || ""} onChange={(event) => handleCheckpointChange("current_problem", event.target.value)} placeholder="What is blocked or unfinished?" rows={3} /></label>
              </div>
              <div className="form-two-column">
                <label>Next action<textarea value={checkpointForm.next_action || ""} onChange={(event) => handleCheckpointChange("next_action", event.target.value)} placeholder="What should happen next?" rows={2} /></label>
                <label>Focus state<textarea value={checkpointForm.user_focus_state || ""} onChange={(event) => handleCheckpointChange("user_focus_state", event.target.value)} placeholder="What should AIRA keep in mind?" rows={2} /></label>
              </div>
              <label>Confidence (1–10)<input type="number" min="1" max="10" value={checkpointForm.confidence ?? ""} onChange={(event) => handleCheckpointChange("confidence", event.target.value)} placeholder="Optional" /></label>
              <button className="primary-button" type="submit" disabled={savingCheckpoint || !checkpointForm.title.trim() || !checkpointForm.summary.trim()}>
                <Save size={16} /> {savingCheckpoint ? "Saving…" : "Save Checkpoint"}
              </button>
            </form>

            <div className="content-card task-panel">
              <div className="card-heading-row">
                <div>
                  <div className="card-eyebrow"><ListTodo size={14} /> Execution</div>
                  <h3>Project Tasks</h3>
                </div>
                <span className="task-count">{tasks.length}</span>
              </div>
              <form className="task-form" onSubmit={handleCreateTask}>
                <label>Task title<input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Add the next concrete step" required /></label>
                <label>Description<textarea value={taskDescription} onChange={(event) => setTaskDescription(event.target.value)} placeholder="Optional details" rows={2} /></label>
                <div className="task-form-footer">
                  <label>Priority<select value={taskPriority} onChange={(event) => setTaskPriority(event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
                  <button className="primary-button" type="submit" disabled={savingTask || !taskTitle.trim()}><Plus size={16} /> {savingTask ? "Adding…" : "Add Task"}</button>
                </div>
              </form>

              <div className="task-list">
                {tasks.length === 0 ? (
                  <div className="empty-card-state"><p>No tasks yet.</p><span>Add a concrete next step for this project.</span></div>
                ) : (
                  tasks.map((task) => (
                    <div className="task-item" key={task.id}>
                      <div className="task-item-icon"><ListTodo size={15} /></div>
                      <div className="task-item-content"><strong>{task.title}</strong>{task.description && <span>{task.description}</span>}<small>{task.status} · {task.priority}</small></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="content-card empty-card-state"><p>No active project is available.</p><span>The backend should create the default AIRA project automatically.</span></div>
      )}
    </div>
  );
}

export default ProjectsPage;
