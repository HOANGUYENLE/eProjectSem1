import React, { useState, useEffect, useCallback } from 'react';
import { getReschedules, createReschedule, updateReschedule, deleteReschedule } from '../services/api';

/* ── helpers ── */
const fmtDate = (d) =>
  d ? new Date(d).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';

const EMPTY_FORM = { appointment_id:'', customer_id:'', old_slot_id:'', new_slot_id:'', reason:'', status:'rescheduled' };

/* ── Toast ── */
function Toast({ msg, type }) {
  return (
    <div className={`toast${type==='err' ? ' err' : ''}`}>
      {type === 'err'
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      }
      {msg}
    </div>
  );
}

/* ── Form Modal (Add / Edit) ── */
function FormModal({ mode, data, onClose, onSuccess }) {
  const [form, setForm]     = useState(mode === 'edit' ? { ...data, new_slot_id: data.new_slot_id ?? '' } : { ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const payload = {
        ...form,
        appointment_id: +form.appointment_id,
        customer_id:    +form.customer_id,
        old_slot_id:    +form.old_slot_id,
        new_slot_id:    form.new_slot_id !== '' ? +form.new_slot_id : null,
      };
      if (mode === 'edit') await updateReschedule(data.id, payload);
      else                 await createReschedule(payload);
      onSuccess(mode === 'edit' ? 'Cập nhật thành công!' : 'Thêm yêu cầu thành công!');
    } catch (ex) {
      const d = ex.response?.data;
      setErr(d?.message || (d?.errors ? Object.values(d.errors).flat().join(' ') : 'Có lỗi xảy ra.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-head-left">
            <div className="modal-head-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </div>
            <h3>{mode === 'edit' ? 'Chỉnh sửa yêu cầu' : 'Thêm yêu cầu dời / hủy lịch'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-body">
            {err && (
              <div className="alert alert-err">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {err}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ID Lịch hẹn <span className="req">*</span></label>
                <input type="number" name="appointment_id" className="form-input"
                  placeholder="VD: 1" value={form.appointment_id} onChange={set} required min="1"/>
              </div>
              <div className="form-group">
                <label className="form-label">ID Khách hàng <span className="req">*</span></label>
                <input type="number" name="customer_id" className="form-input"
                  placeholder="VD: 1" value={form.customer_id} onChange={set} required min="1"/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Slot cũ <span className="req">*</span></label>
                <input type="number" name="old_slot_id" className="form-input"
                  placeholder="VD: 201" value={form.old_slot_id} onChange={set} required min="1"/>
              </div>
              <div className="form-group">
                <label className="form-label">Slot mới</label>
                <input type="number" name="new_slot_id" className="form-input"
                  placeholder="Để trống nếu hủy" value={form.new_slot_id} onChange={set} min="1"/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lý do</label>
              <input type="text" name="reason" className="form-input"
                placeholder="Nhập lý do dời / hủy lịch..." value={form.reason} onChange={set} maxLength="255"/>
            </div>

            <div className="form-group">
              <label className="form-label">Trạng thái <span className="req">*</span></label>
              <select name="status" className="form-input" value={form.status} onChange={set} required>
                <option value="rescheduled">Dời lịch (Rescheduled)</option>
                <option value="canceled">Hủy lịch (Canceled)</option>
              </select>
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading
                ? <><div className="spinner" style={{width:14,height:14,borderWidth:2}}/> Đang lưu...</>
                : mode === 'edit' ? 'Lưu thay đổi' : 'Thêm yêu cầu'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ item, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try { await deleteReschedule(item.id); onSuccess('Đã xóa yêu cầu thành công!'); }
    catch { onClose(); }
    finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-head">
          <div className="modal-head-left">
            <div className="modal-head-icon is-danger">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h3>Xác nhận xóa</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="confirm-center">
            <div className="confirm-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h4>Xóa yêu cầu #{item.id}?</h4>
            <p>Yêu cầu dời/hủy lịch của khách hàng <strong style={{color:'var(--dark)'}}>KH-{item.customer_id}</strong> sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.</p>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={onClose} disabled={loading}>Hủy bỏ</button>
          <button className="btn btn-danger btn-sm" onClick={confirm} disabled={loading}>
            {loading
              ? <><div className="spinner" style={{width:14,height:14,borderWidth:2}}/> Đang xóa...</>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg> Xóa ngay</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ReschedulesPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [statusF, setStatusF] = useState('all');
  const [modal, setModal]     = useState(null); // { type, data? }
  const [toast, setToast]     = useState(null); // { msg, type }

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const r = await getReschedules(); setRows(r.data.data || []); }
    catch { setError('Không thể kết nối API. Kiểm tra Laravel backend.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSuccess = (msg) => {
    setModal(null);
    showToast(msg);
    load();
  };

  const filtered = rows.filter(r => {
    const matchStatus = statusF === 'all' || r.status === statusF;
    const q = search.toLowerCase();
    const matchQ = q === '' ||
      String(r.id).includes(q) ||
      String(r.appointment_id).includes(q) ||
      String(r.customer_id).includes(q) ||
      (r.reason || '').toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  const total      = rows.length;
  const resch      = rows.filter(r => r.status === 'rescheduled').length;
  const canceled   = rows.filter(r => r.status === 'canceled').length;

  return (
    <>
      {/* Toast */}
      <div className="toast-wrap">
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </div>

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div style={{fontSize:12,color:'var(--muted)',marginBottom:4}}>
              Home / <span style={{color:'var(--primary)'}}>Reschedule Management</span>
            </div>
            <h1 className="page-hero-title">Reschedule & Cancellation</h1>
            <p className="page-hero-sub">Luật sư & khách hàng quản lý yêu cầu thay đổi lịch hẹn</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal({ type: 'add' })}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Tạo yêu cầu mới
          </button>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon si-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </div>
            <div><div className="stat-label">Tổng yêu cầu</div><div className="stat-value">{total}</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon si-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
              </svg>
            </div>
            <div><div className="stat-label">Dời lịch</div><div className="stat-value">{resch}</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon si-orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div><div className="stat-label">Hủy lịch</div><div className="stat-value">{canceled}</div></div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Tìm theo ID, khách hàng, lý do..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="search-btn">Search</button>
          <select className="filter-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="rescheduled">Dời lịch</option>
            <option value="canceled">Hủy lịch</option>
          </select>
        </div>

        {/* Table panel */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              Danh sách yêu cầu
              <span className="count-pill">{filtered.length}</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={load} title="Refresh">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner"/><span>Đang tải...</span></div>
          ) : error ? (
            <div style={{padding:32}}>
              <div className="alert alert-err">{error}</div>
              <button className="btn btn-outline btn-sm" onClick={load}>Thử lại</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
              </div>
              <h4>{search || statusF !== 'all' ? 'Không tìm thấy kết quả' : 'Chưa có yêu cầu nào'}</h4>
              <p>{search || statusF !== 'all' ? 'Thử thay đổi bộ lọc.' : 'Nhấn "Tạo yêu cầu mới" để bắt đầu.'}</p>
            </div>
          ) : (
            <div style={{overflowX:'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Lịch hẹn</th>
                    <th>Khách hàng</th>
                    <th>Slot cũ</th>
                    <th>Slot mới</th>
                    <th>Lý do</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <span style={{fontWeight:700,color:'var(--primary)'}}>#{r.id}</span>
                      </td>
                      <td>
                        <span className="chip chip-blue">LH-{r.appointment_id}</span>
                      </td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:7}}>
                          <div style={{
                            width:28,height:28,borderRadius:'50%',
                            background:'linear-gradient(135deg,#4299e1,#2b6cb0)',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            color:'white',fontSize:11,fontWeight:700,flexShrink:0
                          }}>{r.customer_id}</div>
                          <span style={{fontWeight:500,color:'var(--dark)'}}>KH-{r.customer_id}</span>
                        </div>
                      </td>
                      <td>
                        <code style={{background:'#f7fafc',padding:'3px 8px',borderRadius:5,fontSize:12,border:'1px solid var(--border)'}}>
                          #{r.old_slot_id}
                        </code>
                      </td>
                      <td>
                        {r.new_slot_id
                          ? <code style={{background:'#f0fff4',padding:'3px 8px',borderRadius:5,fontSize:12,border:'1px solid #c6f6d5',color:'var(--success)'}}>#{r.new_slot_id}</code>
                          : <span style={{color:'var(--light)',fontSize:12}}>—</span>
                        }
                      </td>
                      <td style={{maxWidth:180}}>
                        {r.reason
                          ? <span style={{fontSize:12,color:'var(--muted)'}} title={r.reason}>
                              {r.reason.length > 40 ? r.reason.slice(0,40) + '…' : r.reason}
                            </span>
                          : <span style={{color:'var(--light)',fontSize:12}}>—</span>
                        }
                      </td>
                      <td>
                        {r.status === 'rescheduled'
                          ? <span className="badge badge-rescheduled">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 4 23 10 17 10"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/></svg>
                              Dời lịch
                            </span>
                          : <span className="badge badge-canceled">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              Hủy lịch
                            </span>
                        }
                      </td>
                      <td style={{fontSize:12,color:'var(--muted)',whiteSpace:'nowrap'}}>{fmtDate(r.created_at)}</td>
                      <td>
                        <div style={{display:'flex',gap:6}}>
                          <button className="act-btn act-edit" onClick={() => setModal({ type:'edit', data:r })}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
                            </svg>
                            Sửa
                          </button>
                          <button className="act-btn act-del" onClick={() => setModal({ type:'delete', data:r })}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
                            </svg>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal?.type === 'add'    && <FormModal mode="add"  onClose={() => setModal(null)} onSuccess={handleSuccess}/>}
      {modal?.type === 'edit'   && <FormModal mode="edit" data={modal.data} onClose={() => setModal(null)} onSuccess={handleSuccess}/>}
      {modal?.type === 'delete' && <DeleteModal item={modal.data} onClose={() => setModal(null)} onSuccess={handleSuccess}/>}
    </>
  );
}
