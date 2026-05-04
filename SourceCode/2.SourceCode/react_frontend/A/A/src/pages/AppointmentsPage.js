import React, { useState, useEffect, useCallback } from 'react';
import { getAppointments, createAppointment } from '../services/api';

/* ── helpers ── */
const COLORS = ['ava-blue','ava-purple','ava-green','ava-orange','ava-teal','ava-red','ava-indigo'];
const avatarColor = (id) => COLORS[id % COLORS.length];

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }) : '—';

/* ── Add Modal ── */
function AddModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    customer_id: '', lawyer_id: '', slot_id: '',
    request_text: '', response_text: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      await createAppointment({
        ...form,  
        customer_id: +form.customer_id,
        lawyer_id:   +form.lawyer_id,
        slot_id:     +form.slot_id,
      });
      onSuccess('Thêm lịch hẹn thành công!');
    } catch (ex) {
      const d = ex.response?.data;
      setErr(d?.message || (d?.errors ? Object.values(d.errors).flat().join(' ') : 'Có lỗi xảy ra.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-head-left">
            <div className="modal-head-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Đặt lịch hẹn mới</h3>
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
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {err}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ID Khách hàng <span className="req">*</span></label>
                <input type="number" name="customer_id" className="form-input"
                  placeholder="VD: 1" value={form.customer_id} onChange={set} required min="1"/>
              </div>
              <div className="form-group">
                <label className="form-label">ID Luật sư <span className="req">*</span></label>
                <input type="number" name="lawyer_id" className="form-input"
                  placeholder="VD: 101" value={form.lawyer_id} onChange={set} required min="1"/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">ID Khung giờ (Slot) <span className="req">*</span></label>
              <input type="number" name="slot_id" className="form-input"
                placeholder="VD: 201" value={form.slot_id} onChange={set} required min="1"/>
            </div>

            <div className="form-group">
              <label className="form-label">Nội dung yêu cầu tư vấn</label>
              <textarea name="request_text" className="form-input"
                placeholder="Mô tả vấn đề pháp lý bạn cần tư vấn..."
                value={form.request_text} onChange={set}/>
            </div>

            <div className="form-group">
              <label className="form-label">Phản hồi từ luật sư</label>
              <textarea name="response_text" className="form-input"
                placeholder="Luật sư nhập phản hồi tại đây..."
                value={form.response_text} onChange={set}
                style={{ minHeight: 64 }}/>
            </div>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading
                ? <><div className="spinner" style={{width:14,height:14,borderWidth:2}}/> Đang lưu...</>
                : <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Đặt lịch hẹn
                  </>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Detail Modal ── */
function DetailModal({ appt, onClose }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 540 }}>
        <div className="modal-head">
          <div className="modal-head-left">
            <div className={`card-avatar ${avatarColor(appt.id)}`}
              style={{width:38, height:38, fontSize:14, marginRight:10}}>
              {appt.customer_id}
              <span className="pro-label">PRO</span>
            </div>
            <div>
              <h3 style={{fontSize:15}}>Chi tiết lịch hẹn #{appt.id}</h3>
              <p style={{fontSize:11, color:'var(--muted)', marginTop:1}}>
                Khách hàng ID: {appt.customer_id}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
            {[
              ['ID Lịch hẹn',  `#${appt.id}`,            'chip-blue'],
              ['Khách hàng',   `KH-${appt.customer_id}`, 'chip-gray'],
              ['Luật sư',      `LS-${appt.lawyer_id}`,   'chip-green'],
              ['Slot',         `Slot #${appt.slot_id}`,  'chip-orange'],
            ].map(([label, val, cls]) => (
              <div key={label} style={{
                background:'#f8fafc', borderRadius:8,
                padding:'12px 14px', border:'1px solid var(--border)',
              }}>
                <div style={{fontSize:11, color:'var(--muted)', fontWeight:600,
                  marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em'}}>
                  {label}
                </div>
                <span className={`chip ${cls}`} style={{fontSize:12, padding:'3px 10px'}}>
                  {val}
                </span>
              </div>
            ))}
          </div>

          {appt.request_text && (
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11, color:'var(--muted)', fontWeight:600,
                marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em'}}>
                Nội dung yêu cầu
              </div>
              <div style={{
                background:'#f8faff', border:'1px solid #bee3f8',
                borderLeft:'3px solid var(--primary)', borderRadius:6,
                padding:'10px 12px', fontSize:13, color:'var(--text)', lineHeight:1.6,
              }}>
                {appt.request_text}
              </div>
            </div>
          )}

          {appt.response_text && (
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11, color:'var(--muted)', fontWeight:600,
                marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em'}}>
                Phản hồi của luật sư
              </div>
              <div style={{
                background:'#f0fff4', border:'1px solid #c6f6d5',
                borderLeft:'3px solid #38a169', borderRadius:6,
                padding:'10px 12px', fontSize:13, color:'var(--text)', lineHeight:1.6,
              }}>
                {appt.response_text}
              </div>
            </div>
          )}

          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
            <span style={{fontSize:11, color:'var(--muted)'}}>
              Ngày tạo: <strong>{fmtDate(appt.created_at)}</strong>
            </span>
            <span style={{fontSize:11, color:'var(--muted)'}}>
              · Cập nhật: <strong>{fmtDate(appt.updated_at)}</strong>
            </span>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ── Appointment Card ── */
function ApptCard({ appt, onClick }) {
  const col = avatarColor(appt.id);

  return (
    <div className="appt-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-top">
        <div className={`card-avatar ${col}`}>
          {appt.customer_id}
          <span className="pro-label">PRO</span>
        </div>

        <div className="card-info">
          <div className="card-name">Khách hàng #{appt.customer_id}</div>
          <div className="card-subtitle">
            Luật sư #{appt.lawyer_id} · Slot #{appt.slot_id}
          </div>
          <div className="card-tags">
            <span className="chip chip-blue">LH-{appt.id}</span>
            {appt.response_text
              ? <span className="chip chip-green">✓ Đã phản hồi</span>
              : <span className="chip chip-gray">Chờ phản hồi</span>
            }
          </div>
        </div>
      </div>

      <div className="card-meta">
        <div className="meta-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Đặt ngày: <strong>{fmtDate(appt.created_at)}</strong></span>
        </div>

        <div className="meta-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>Luật sư ID: <strong>{appt.lawyer_id}</strong></span>
        </div>

        {appt.request_text && (
          <div className="card-request">
            {appt.request_text.length > 80
              ? appt.request_text.slice(0, 80) + '…'
              : appt.request_text}
          </div>
        )}

        <p className="card-no-reviews">
          {appt.response_text ? '✓ Luật sư đã phản hồi' : 'Chưa có phản hồi từ luật sư'}
        </p>
      </div>

      <div className="card-footer">
        <button className="btn-view-book" onClick={e => { e.stopPropagation(); onClick(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Xem chi tiết lịch hẹn
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function AppointmentsPage() {
  const [appts,   setAppts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [detail,  setDetail]  = useState(null);
  const [toast,   setToast]   = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const r = await getAppointments();
      setAppts(r.data.data || []);
    } catch {
      setError('Không thể kết nối API. Kiểm tra Laravel backend.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3200); };
  const handleAdd = (msg) => { setShowAdd(false); showToast(msg); load(); };

  const filtered = appts.filter(a =>
    search === '' ||
    String(a.customer_id).includes(search) ||
    String(a.lawyer_id).includes(search) ||
    String(a.id).includes(search) ||
    (a.request_text || '').toLowerCase().includes(search.toLowerCase())
  );

  const replied = appts.filter(a => a.response_text).length;
  const pending = appts.length - replied;
  // FIX: sử dụng biến lawyers trong stat card thay vì bỏ phí
  const lawyers = new Set(appts.map(a => a.lawyer_id)).size;

  return (
    <>
      {/* Toast */}
      <div className="toast-wrap">
        {toast && (
          <div className="toast">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="var(--success)" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {toast}
          </div>
        )}
      </div>

      {/* Page hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div style={{fontSize:12, color:'var(--muted)', marginBottom:4}}>
              Home / <span style={{color:'var(--primary)'}}>Appointment Management</span>
            </div>
            <h1 className="page-hero-title">Appointment Directory</h1>
            <p className="page-hero-sub">Quản lý toàn bộ lịch hẹn tư vấn pháp lý</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Book a Consultation
          </button>
        </div>
      </div>

      <div className="container">
        {/* FIX: 4 stat cards - dùng biến lawyers đã tính */}
        <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          <div className="stat-card">
            <div className="stat-icon si-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <div className="stat-label">Tổng lịch hẹn</div>
              <div className="stat-value">{appts.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon si-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <div className="stat-label">Đã phản hồi</div>
              <div className="stat-value">{replied}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon si-orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <div className="stat-label">Chờ phản hồi</div>
              <div className="stat-value">{pending}</div>
            </div>
          </div>
          {/* FIX: stat card thứ 4 - hiển thị số luật sư */}
          <div className="stat-card">
            <div className="stat-icon si-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <div className="stat-label">Luật sư</div>
              <div className="stat-value">{lawyers}</div>
            </div>
          </div>
        </div>

        {/* Search & filter row */}
        <div className="toolbar">
          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Tìm kiếm theo ID khách hàng, luật sư, nội dung..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="search-btn" onClick={() => {}}>Search</button>
          <select className="filter-select">
            <option>All locations</option>
            <option>Quận 1, HCM</option>
            <option>Quận 7, HCM</option>
          </select>
          <select className="filter-select">
            <option>All specialties</option>
            <option>Dân sự</option>
            <option>Hình sự</option>
            <option>Hôn nhân</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"/>
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div style={{textAlign:'center', padding:'48px 0'}}>
            <div className="alert alert-err" style={{display:'inline-flex', maxWidth:440}}>
              {error}
            </div>
            <br/>
            <button className="btn btn-outline btn-sm" style={{marginTop:12}} onClick={load}>
              Thử lại
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h4>{search ? 'Không tìm thấy kết quả' : 'Chưa có lịch hẹn nào'}</h4>
            <p>{search ? 'Thử từ khóa khác.' : 'Nhấn "Book a Consultation" để đặt lịch đầu tiên.'}</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filtered.map(a => (
              <ApptCard key={a.id} appt={a} onClick={() => setDetail(a)} />
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSuccess={handleAdd} />}
      {detail  && <DetailModal appt={detail} onClose={() => setDetail(null)} />}
    </>
  );
}
