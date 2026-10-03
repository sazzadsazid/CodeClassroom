const fs = require('fs');
const path = require('path');
function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  if (content !== original) fs.writeFileSync(filePath, content);
}
const studentPagesDir = 'src/features/student/pages';
fs.readdirSync(studentPagesDir).forEach(f => {
  if (f.endsWith('.tsx')) {
    replaceInFile(path.join(studentPagesDir, f), [
      [/from '\.\.\/components/g, "from '../../components"],
      [/from '\.\.\/data/g, "from '../../data"],
      [/from '\.\.\/context/g, "from '../../features/auth/context"]
    ]);
  }
});
const teacherPagesDir = 'src/features/teacher/pages';
fs.readdirSync(teacherPagesDir).forEach(f => {
  if (f.endsWith('.tsx')) {
    replaceInFile(path.join(teacherPagesDir, f), [
      [/from '\.\.\/\.\.\/components/g, "from '../../../components"],
      [/from '\.\.\/\.\.\/data/g, "from '../../../data"],
      [/from '\.\.\/\.\.\/context/g, "from '../../../features/auth/context"]
    ]);
  }
});
const adminPagesDir = 'src/features/admin/pages';
fs.readdirSync(adminPagesDir).forEach(f => {
  if (f.endsWith('.tsx')) {
    replaceInFile(path.join(adminPagesDir, f), [
      [/from '\.\.\/\.\.\/components/g, "from '../../../components"],
      [/from '\.\.\/\.\.\/data/g, "from '../../../data"],
      [/from '\.\.\/\.\.\/context/g, "from '../../../features/auth/context"]
    ]);
  }
});
const authPagesDir = 'src/features/auth/pages';
fs.readdirSync(authPagesDir).forEach(f => {
  if (f.endsWith('.tsx')) {
    replaceInFile(path.join(authPagesDir, f), [
      [/from '\.\.\/components/g, "from '../../components"],
      [/from '\.\.\/data/g, "from '../../data"],
      [/from '\.\.\/context/g, "from '../context"]
    ]);
  }
});
const publicPagesDir = 'src/features/public/pages';
fs.readdirSync(publicPagesDir).forEach(f => {
  if (f.endsWith('.tsx')) {
    replaceInFile(path.join(publicPagesDir, f), [
      [/from '\.\.\/components/g, "from '../../components"],
      [/from '\.\.\/data/g, "from '../../data"],
      [/from '\.\.\/context/g, "from '../../features/auth/context"]
    ]);
  }
});
const layoutDir = 'src/components/layout';
fs.readdirSync(layoutDir).forEach(f => {
  if (f.endsWith('.tsx')) {
    replaceInFile(path.join(layoutDir, f), [
      [/from '\.\.\/context/g, "from '../../features/auth/context"],
      [/from '\.\.\/data/g, "from '../../data"]
    ]);
  }
});
replaceInFile('src/main.tsx', [
  [/from '\.\/App'/g, "from './app/App'"]
]);
replaceInFile('src/app/App.tsx', [
  [/from '\.\/context/g, "from '../features/auth/context"],
  [/from '\.\/components/g, "from '../components"],
  [/from '\.\/pages\/Login'/g, "from '../features/auth/pages/Login'"],
  [/from '\.\/pages\/Home'/g, "from '../features/public/pages/Home'"],
  [/from '\.\/pages\/admin/g, "from '../features/admin/pages"],
  [/from '\.\/pages\/teacher/g, "from '../features/teacher/pages"],
  [/from '\.\/pages\//g, "from '../features/student/pages/'"]
]);
