import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Code2 } from 'lucide-react';
import { Card } from '../../../components/ui';

const LANGUAGES = ['Java', 'Python', 'TypeScript', 'JavaScript', 'C++', 'C#', 'Go', 'Rust', 'Multiple'];

const STARTER_DEFAULTS: Record<string, string> = {
  Java: `public class Solution {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
  Python: `def solution():
    # Write your solution here
    pass

if __name__ == '__main__':
    solution()`,
  TypeScript: `function solution(): void {
    // Write your solution here
}

solution();`,
  JavaScript: `function solution() {
    // Write your solution here
}

solution();`,
  'C++': `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
  default: `// Write your solution here`,
};

interface TestCase { input: string; expectedOutput: string; isHidden: boolean; }

const labelStyle: React.CSSProperties = {
  fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontSize: '13px', outline: 'none',
};
const textareaStyle: React.CSSProperties = {
  ...inputStyle, resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: 1.6,
};

const CreateAssignment: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    courseId: 'tc1',
    description: '',
    language: 'Java',
    timeLimit: 60,
    deadline: '',
    maxScore: 100,
    starterCode: STARTER_DEFAULTS.Java,
  });

  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', expectedOutput: '', isHidden: false },
  ]);

  const [saving, setSaving] = useState(false);

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  const handleLanguageChange = (lang: string) => {
    set('language', lang);
    set('starterCode', STARTER_DEFAULTS[lang] ?? STARTER_DEFAULTS.default);
  };

  const addTestCase = () =>
    setTestCases(tc => [...tc, { input: '', expectedOutput: '', isHidden: false }]);

  const removeTestCase = (idx: number) =>
    setTestCases(tc => tc.filter((_, i) => i !== idx));

  const updateTestCase = (idx: number, field: keyof TestCase, value: string | boolean) =>
    setTestCases(tc => tc.map((t, i) => i === idx ? { ...t, [field]: value } : t));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      navigate('/teacher/assignments');
    }, 800);
  };

  const sectionTitle = (t: string) => (
    <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>{t}</h2>
  );

  return (
    <div style={{ maxWidth: '860px' }}>
      <button
        onClick={() => navigate('/teacher/assignments')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '22px', padding: 0 }}
      >
        <ArrowLeft size={15} /> Back to Assignments
      </button>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Basic Info */}
        <Card>
          {sectionTitle('Basic Information')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={labelStyle}>Assignment Title *</label>
              <input
                required value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Implement a Binary Search Tree"
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Course</label>
                <select value={form.courseId} onChange={e => set('courseId', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="tc1">Data Structures & Algorithms</option>
                  <option value="tc2">Full-Stack Web Development</option>
                  <option value="tc3">Python for Data Science</option>
                  <option value="tc4">System Design Fundamentals</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Programming Language *</label>
                <select value={form.language} onChange={e => handleLanguageChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Max Score (pts)</label>
                <input type="number" min={1} max={500} value={form.maxScore} onChange={e => set('maxScore', Number(e.target.value))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Time Limit (minutes) *</label>
                <input required type="number" min={5} max={480} value={form.timeLimit} onChange={e => set('timeLimit', Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Deadline *</label>
                <input required type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                required rows={5} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the assignment goals, context, and what students need to accomplish…"
                style={textareaStyle}
              />
            </div>
          </div>
        </Card>

        {/* Starter Code */}
        <Card>
          {sectionTitle('Starter Code')}
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            This code will be pre-loaded in the student's editor when they open the assignment.
          </p>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '12px', display: 'flex', alignItems: 'center', gap: '5px', zIndex: 1 }}>
              <Code2 size={13} color="var(--color-text-muted)" />
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{form.language}</span>
            </div>
            <textarea
              rows={14} value={form.starterCode} onChange={e => set('starterCode', e.target.value)}
              style={{ ...textareaStyle, fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace', fontSize: '13px', lineHeight: 1.6, backgroundColor: '#0d1117', color: '#e6edf3', border: '1px solid #30363d', padding: '14px 16px' }}
            />
          </div>
        </Card>

        {/* Test Cases */}
        <Card>
          {sectionTitle('Test Cases')}
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
            Define inputs and expected outputs. Hidden test cases are not visible to students.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {testCases.map((tc, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--color-bg-hover)', borderRadius: '10px', padding: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Test Case #{idx + 1}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={tc.isHidden} onChange={e => updateTestCase(idx, 'isHidden', e.target.checked)} />
                      Hidden
                    </label>
                    {testCases.length > 1 && (
                      <button type="button" onClick={() => removeTestCase(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Input</label>
                    <textarea rows={3} value={tc.input} onChange={e => updateTestCase(idx, 'input', e.target.value)} placeholder="e.g. insert(5), search(5)" style={{ ...textareaStyle, fontSize: '12px', fontFamily: 'monospace', backgroundColor: 'var(--color-bg-primary)' }} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Expected Output</label>
                    <textarea rows={3} value={tc.expectedOutput} onChange={e => updateTestCase(idx, 'expectedOutput', e.target.value)} placeholder="e.g. true" style={{ ...textareaStyle, fontSize: '12px', fontFamily: 'monospace', backgroundColor: 'var(--color-bg-primary)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button" onClick={addTestCase}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '8px 16px', borderRadius: '8px', border: '1px dashed var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-accent)', fontSize: '13px', cursor: 'pointer', width: '100%', justifyContent: 'center', fontWeight: 500 }}
          >
            <Plus size={14} /> Add Test Case
          </button>
        </Card>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingBottom: '28px' }}>
          <button
            type="button" onClick={() => navigate('/teacher/assignments')}
            style={{ padding: '10px 22px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '14px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="submit" disabled={saving}
            style={{ padding: '10px 28px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Creating…' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;
