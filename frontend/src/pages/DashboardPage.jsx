import { useEffect, useState } from 'react';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import Navbar from '../components/ui/Navbar';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskModal from '../components/tasks/TaskModal';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { fetchTasks, loading, counts, searchQuery, setSearchQuery } = useTaskStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const totalTasks = (counts.Todo || 0) + (counts['In Progress'] || 0) + (counts.Done || 0);
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className={styles.page}>
      <Navbar onCreateTask={openCreate} />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.greeting}>
              Hey, <span className={styles.name}>{firstName}</span> 👋
            </h1>
            <p className={styles.subtitle}>
              {totalTasks === 0
                ? 'No tasks yet. Create one to get started!'
                : `You have ${totalTasks} task${totalTasks !== 1 ? 's' : ''} across ${counts['In Progress'] || 0} in progress`}
            </p>
          </div>

          <button className={styles.createBtn} onClick={openCreate}>
            <span>+</span> New Task
          </button>
        </div>

        {/* Stats bar */}
        <div className={styles.stats}>
          <div className={`${styles.stat} ${styles.todo}`}>
            <span className={styles.statCount}>{counts.Todo || 0}</span>
            <span className={styles.statLabel}>Todo</span>
          </div>
          <div className={`${styles.stat} ${styles.inprogress}`}>
            <span className={styles.statCount}>{counts['In Progress'] || 0}</span>
            <span className={styles.statLabel}>In Progress</span>
          </div>
          <div className={`${styles.stat} ${styles.done}`}>
            <span className={styles.statCount}>{counts.Done || 0}</span>
            <span className={styles.statLabel}>Done</span>
          </div>
        </div>

        {/* Search bar */}
        <div className={styles.searchRow}>
          <div className={styles.search}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchTasks({ search: e.target.value });
              }}
            />
          </div>
        </div>

        {/* Kanban Board */}
        {loading && !totalTasks ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
            <p>Loading tasks...</p>
          </div>
        ) : (
          <KanbanBoard onEditTask={openEdit} />
        )}
      </main>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default DashboardPage;
