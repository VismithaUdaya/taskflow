import { useState } from 'react';
import toast from 'react-hot-toast';
import { format, isPast, isToday } from 'date-fns';
import useTaskStore from '../../store/taskStore';
import styles from './TaskCard.module.css';

const PRIORITY_META = {
  Low: { label: 'Low', class: 'low' },
  Medium: { label: 'Medium', class: 'medium' },
  High: { label: 'High', class: 'high' },
};

const STAGES = ['Todo', 'In Progress', 'Done'];

function TaskCard({ task, onEdit, onDragStart, onDragEnd, isDragging }) {
  const { deleteTask, moveTask } = useTaskStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const priority = PRIORITY_META[task.priority] || PRIORITY_META.Medium;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this task?')) return;
    setDeleting(true);
    const result = await deleteTask(task._id);
    if (result.success) {
      toast.success('Task deleted');
    } else {
      toast.error(result.error);
      setDeleting(false);
    }
  };

  const handleMoveStage = async (stage) => {
    setMenuOpen(false);
    if (stage === task.stage) return;
    const result = await moveTask(task._id, stage);
    if (result.success) {
      toast.success(`Moved to ${stage}`);
    } else {
      toast.error('Failed to move');
    }
  };

  // Format due date
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && task.stage !== 'Done';
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.dragging : ''} ${deleting ? styles.deleting : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Priority strip */}
      <div className={`${styles.priorityStrip} ${styles[`strip_${priority.class}`]}`} />

      <div className={styles.content}>
        {/* Top row: priority + actions */}
        <div className={styles.topRow}>
          <span className={`${styles.priorityBadge} ${styles[priority.class]}`}>
            {priority.label}
          </span>

          <div className={styles.actions}>
            <button
              className={styles.actionBtn}
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              title="Edit task"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>

            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={handleDelete}
              title="Delete task"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className={`${styles.title} ${task.stage === 'Done' ? styles.done : ''}`}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        {/* Bottom row: due date + move dropdown */}
        <div className={styles.bottomRow}>
          {dueDate && (
            <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''} ${isDueToday ? styles.today : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {isOverdue ? 'Overdue · ' : isDueToday ? 'Today · ' : ''}
              {format(dueDate, 'MMM d')}
            </span>
          )}

          {/* Quick stage move */}
          <div className={styles.moveMenu}>
            <button
              className={styles.moveBtn}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            >
              Move ↓
            </button>
            {menuOpen && (
              <div className={styles.moveDropdown}>
                {STAGES.filter((s) => s !== task.stage).map((s) => (
                  <button key={s} onClick={() => handleMoveStage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
