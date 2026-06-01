import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import useTaskStore from '../../store/taskStore';
import styles from './TaskModal.module.css';

const STAGES = ['Todo', 'In Progress', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High'];

function TaskModal({ task, onClose }) {
  const isEditing = Boolean(task);
  const { createTask, updateTask } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    stage: task?.stage || 'Todo',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
  });

  useEffect(() => {
    firstInputRef.current?.focus();
    // Trap Escape key
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Task title is required');

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      stage: form.stage,
      priority: form.priority,
      dueDate: form.dueDate || null,
    };

    const result = isEditing
      ? await updateTask(task._id, payload)
      : await createTask(payload);

    setLoading(false);

    if (result.success) {
      toast.success(isEditing ? 'Task updated!' : 'Task created!');
      onClose();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{isEditing ? 'Edit Task' : 'New Task'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title */}
          <div className={styles.field}>
            <label htmlFor="title">Title <span className={styles.required}>*</span></label>
            <input
              ref={firstInputRef}
              id="title"
              name="title"
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label htmlFor="description">Description <span className={styles.optional}>(optional)</span></label>
            <textarea
              id="description"
              name="description"
              placeholder="Add more context..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Stage + Priority row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="stage">Stage</label>
              <select id="stage" name="stage" value={form.stage} onChange={handleChange}>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div className={styles.field}>
            <label htmlFor="dueDate">Due Date <span className={styles.optional}>(optional)</span></label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                isEditing ? 'Save Changes' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
