'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [activeProj, setActiveProj] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', priority: 'medium', due: '' })

  async function loadData() {
    const p = await fetch('/api/projects').then(r => r.json()).catch(() => [])
    const t = await fetch('/api/tasks').then(r => r.json()).catch(() => [])
    setProjects(Array.isArray(p) ? p : [])
    setTasks(Array.isArray(t) ? t : [])
  }

  useEffect(() => { loadData() }, [])

  const filtered = tasks
    .filter((t: any) => activeProj ? t.projectId === activeProj : true)
    .filter((t: any) => filter === 'all' ? true : filter === 'done' ? t.done : !t.done)

  async function addTask() {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, projectId: projects[0]?.id })
    })
    setShowModal(false)
    setForm({ title: '', priority: 'medium', due: '' })
    loadData()
  }

  async function toggleDone(task: any) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done })
    })
    console.log('toggle status:', res.status)
    const data = await res.json()
    console.log('toggle response:', data)
    loadData()
  }

  async function deleteTask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    loadData()
  }

  const s = {
    app: { display: 'flex', height: '100vh', fontFamily: 'sans-serif', background: '#ffffff', color: '#111111' } as any,
    sidebar: { width: 220, background: '#f0f0f0', borderRight: '1px solid #dddddd', padding: 16 } as any,
    logo: { fontWeight: 700, fontSize: 18, marginBottom: 20, color: '#111111' } as any,
    projItem: (active: boolean) => ({ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 4, background: active ? '#378ADD' : 'transparent', color: active ? '#ffffff' : '#111111' } as any),
    topbar: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #dddddd', background: '#ffffff' } as any,
    topbarTitle: { flex: 1, fontWeight: 600, color: '#111111' } as any,
    filterBtn: (active: boolean) => ({ padding: '5px 12px', borderRadius: 8, border: '1px solid #dddddd', cursor: 'pointer', background: active ? '#378ADD' : '#ffffff', color: active ? '#ffffff' : '#111111' } as any),
    addBtn: { padding: '6px 16px', background: '#378ADD', color: '#ffffff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 } as any,
    taskList: { flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8, background: '#ffffff' } as any,
    taskCard: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid #dddddd', borderRadius: 10, background: '#ffffff' } as any,
    taskTitle: (done: boolean) => ({ fontWeight: 500, color: '#111111', textDecoration: done ? 'line-through' : 'none' } as any),
    taskMeta: { fontSize: 12, color: '#666666', marginTop: 2 } as any,
    deleteBtn: { padding: '4px 10px', fontSize: 12, border: '1px solid #ffcccc', borderRadius: 6, cursor: 'pointer', color: '#cc0000', background: '#ffffff' } as any,
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99 } as any,
    modal: { background: '#ffffff', borderRadius: 12, padding: 24, width: 360, color: '#111111' } as any,
    modalTitle: { fontWeight: 600, marginBottom: 16, color: '#111111', fontSize: 16 } as any,
    input: { width: '100%', padding: 8, border: '1px solid #dddddd', borderRadius: 8, marginBottom: 10, fontSize: 14, color: '#111111', background: '#ffffff' } as any,
    cancelBtn: { padding: '7px 16px', border: '1px solid #dddddd', borderRadius: 8, cursor: 'pointer', background: '#ffffff', color: '#111111' } as any,
    saveBtn: { padding: '7px 16px', background: '#378ADD', color: '#ffffff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 } as any,
  }

  return (
    <div style={s.app}>
      <div style={s.sidebar}>
        <div style={s.logo}>Task<span style={{ color: '#378ADD' }}>Flow</span> Pro</div>
        <div onClick={() => setActiveProj(null)} style={s.projItem(!activeProj)}>
          All Tasks ({tasks.length})
        </div>
        {projects.map((p: any) => (
          <div key={p.id} onClick={() => setActiveProj(p.id)} style={s.projItem(activeProj === p.id)}>
            {p.name}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={s.topbar}>
          <div style={s.topbarTitle}>Tasks</div>
          {['all', 'todo', 'done'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={s.filterBtn(filter === f)}>{f}</button>
          ))}
          <button onClick={() => setShowModal(true)} style={s.addBtn}>+ Add Task</button>
        </div>

        <div style={s.taskList}>
          {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#999999', marginTop: 40 }}>No tasks yet! Add one.</div>}
          {filtered.map((task: any) => (
            <div key={task.id} style={s.taskCard}>
              <button onClick={() => toggleDone(task)}
                style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #cccccc', background: task.done ? '#1D9E75' : '#ffffff', cursor: 'pointer', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={s.taskTitle(task.done)}>{task.title}</div>
                <div style={s.taskMeta}>{task.priority} · {task.due}</div>
              </div>
              <button onClick={() => deleteTask(task.id)} style={s.deleteBtn}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalTitle}>New Task</div>
            <input placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={s.input} />
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={s.input}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input placeholder="Due date e.g. Apr 20" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} style={s.input} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setShowModal(false)} style={s.cancelBtn}>Cancel</button>
              <button onClick={addTask} style={s.saveBtn}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}