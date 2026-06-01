// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';
import './Settings.css';

export default function Settings() {
  const user = getCurrentUser();

  const [form, setForm] = useState({
    displayName: '',
    email: user?.email || '',
    theme: 'light',
    language: 'en',
    notifications: true,
    defaultStorage: 'fridge',
    expiryAlertDays: '3',
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Simulate loading settings from backend
  useEffect(() => {
    setTimeout(() => {
      setForm(f => ({ ...f, displayName: user?.email?.split('@')[0] || 'User' }));
      setLoading(false);
    }, 400);
  }, []);

  function validate() {
    const errs = {};
    if (!form.displayName.trim()) errs.displayName = 'Display name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.expiryAlertDays || isNaN(form.expiryAlertDays) || Number(form.expiryAlertDays) < 1)
      errs.expiryAlertDays = 'Must be at least 1 day.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSaving(true);
    setError('');
    // Simulate PUT /api/settings
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  }

  if (loading) return <div className="loading-spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Manage your account and preferences</p>
      </div>

      {success && <div className="alert alert-success" style={{marginBottom:20}}>{success}</div>}
      {error   && <div className="alert alert-error"   style={{marginBottom:20}}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="settings-sections">

          {/* Profile */}
          <div className="card settings-section">
            <h2 className="settings-section-title">Profile</h2>
            <div className="settings-grid">
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input className={`form-input ${formErrors.displayName?'error':''}`} value={form.displayName} onChange={e=>setForm(f=>({...f,displayName:e.target.value}))} />
                {formErrors.displayName && <span className="form-error">{formErrors.displayName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className={`form-input ${formErrors.email?'error':''}`} type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
                {formErrors.email && <span className="form-error">{formErrors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input className="form-input" value={user?.role || ''} disabled style={{background:'var(--gray-100)',color:'var(--gray-500)'}} />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card settings-section">
            <h2 className="settings-section-title">Preferences</h2>
            <div className="settings-grid">
              <div className="form-group">
                <label className="form-label">Theme</label>
                <select className="form-input" value={form.theme} onChange={e=>setForm(f=>({...f,theme:e.target.value}))}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-input" value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))}>
                  <option value="en">English</option>
                  <option value="he">עברית</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Default Storage View</label>
                <select className="form-input" value={form.defaultStorage} onChange={e=>setForm(f=>({...f,defaultStorage:e.target.value}))}>
                  <option value="all">All</option>
                  <option value="fridge">Fridge</option>
                  <option value="freezer">Freezer</option>
                  <option value="pantry">Pantry</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card settings-section">
            <h2 className="settings-section-title">Notifications</h2>
            <div className="settings-grid">
              <div className="form-group">
                <label className="form-label">Expiry Alert (days before)</label>
                <input
                  className={`form-input ${formErrors.expiryAlertDays?'error':''}`}
                  type="number" min="1" max="30"
                  value={form.expiryAlertDays}
                  onChange={e=>setForm(f=>({...f,expiryAlertDays:e.target.value}))}
                />
                {formErrors.expiryAlertDays && <span className="form-error">{formErrors.expiryAlertDays}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Notifications</label>
                <div className="toggle-row">
                  <input type="checkbox" id="notif" checked={form.notifications} onChange={e=>setForm(f=>({...f,notifications:e.target.checked}))} />
                  <label htmlFor="notif" style={{fontSize:14,color:'var(--gray-700)'}}>
                    Send expiry alerts by email
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving} style={{marginTop:8}}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
