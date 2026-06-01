import { useState } from 'react';
import toast from 'react-hot-toast';
import useTaskStore from '../../store/taskStore';
import TaskCard from './TaskCard';
import styles from './KanbanBoard.module.css';

const STAGES = ['Todo', 'In Progress', 'Done'];

const STAGE_META = {
  'Todo': {
    icon: '○',
    colorClass: 'todo',
    emptyMsg: 'No tasks here yet',
  },
  'In Progress': {
    icon: '◑',
    colorClass: 'inprogress',
    emptyMsg: 'Nothing in progress',
  },
  'Done': {
    icon: '●',
    colorClass: 'done',
    emptyMsg: 'No completed tasks',
  },
};

function KanbanBoard({ onEditTask }) {
  const { grouped, moveTask } = useTaskStore();
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // ─── Drag handlers ──────────────────────────
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setDragOverStage(null);

    if (!draggedTask || draggedTask.stage === targetStage) {
      setDraggedTask(null);
      return;
    }

    const result = await moveTask(draggedTask._id, targetStage);
    if (result.success) {
      toast.success(`Moved to ${targetStage}`);
    } else {
      toast.error('Failed to move task');
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverStage(null);
  };

  return (
    <div className={styles.board}>
      {STAGES.map((stage) => {
        const meta = STAGE_META[stage];
        const tasks = grouped[stage] || [];
        const isDragOver = dragOverStage === stage;

        return (
          <div
            key={stage}
            className={`${styles.column} ${isDragOver ? styles.dragOver : ''}`}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDrop={(e) => handleDrop(e, stage)}
            onDragLeave={() => setDragOverStage(null)}
          >
            {/* Column header */}
            <div className={`${styles.columnHeader} ${styles[meta.colorClass]}`}>
              <div className={styles.columnTitle}>
                <span className={styles.stageIcon}>{meta.icon}</span>
                <span className={styles.stageName}>{stage}</span>
              </div>
              <span className={`${styles.count} ${styles[`count_${meta.colorClass}`]}`}>
                {tasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className={styles.taskList}>
              {tasks.length === 0 ? (
                <div className={`${styles.emptyState} ${isDragOver ? styles.emptyDragOver : ''}`}>
                  <span className={styles.emptyIcon}>
                    {isDragOver ? '⬇' : '✦'}
                  </span>
                  <p>{isDragOver ? `Drop here` : meta.emptyMsg}</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={() => onEditTask(task)}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedTask?._id === task._id}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
