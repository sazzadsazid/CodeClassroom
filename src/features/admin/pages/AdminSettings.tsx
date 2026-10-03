import React from 'react';
import { Save, Globe, Bell, Layout } from 'lucide-react';
import { Card } from '../../../components/ui';

const AdminSettings: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* General Settings */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Globe size={18} color="var(--color-text-secondary)" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>General Settings</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Platform Name</label>
              <input type="text" defaultValue="CodeClassroom" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-hover)', color: 'var(--color-text-primary)', fontSize: '13px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Support Email</label>
              <input type="email" defaultValue="support@codeclassroom.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-hover)', color: 'var(--color-text-primary)', fontSize: '13px' }} />
            </div>
          </div>
        </Card>

        {/* System */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layout size={18} color="var(--color-text-secondary)" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>System Features</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: 'Enable AI Analysis', desc: 'Allow teachers to use AI for session behavior analysis.', active: true },
              { title: 'Public Registration', desc: 'Allow external users to sign up as students.', active: false },
              { title: 'Maintenance Mode', desc: 'Lock the platform for all non-admin users.', active: false },
            ].map(setting => (
              <div key={setting.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg-primary)' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{setting.title}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{setting.desc}</p>
                </div>
                <div style={{ width: '40px', height: '22px', borderRadius: '12px', backgroundColor: setting.active ? '#10b981' : 'var(--color-border)', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: '2px', left: setting.active ? '20px' : '2px', transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Bell size={18} color="var(--color-text-secondary)" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>Send email on new user registration</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>Send weekly system usage report</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>Alert admins on system errors</span>
            </label>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <Save size={16} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
