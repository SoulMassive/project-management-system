import React from 'react';
import { HiOutlineDocumentText, HiOutlineTableCells, HiOutlinePhoto, HiOutlineArchiveBox, HiOutlineCodeBracket, HiOutlineDocument } from 'react-icons/hi2';

const FILE_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'application/pdf': { icon: <HiOutlineDocumentText />, color: '#D85A30', bg: '#FAECE7' },
  'application/msword': { icon: <HiOutlineDocumentText />, color: '#378ADD', bg: '#E6F1FB' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: <HiOutlineDocumentText />, color: '#378ADD', bg: '#E6F1FB' },
  'application/vnd.ms-excel': { icon: <HiOutlineTableCells />, color: '#1D9E75', bg: '#E1F5EE' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: <HiOutlineTableCells />, color: '#1D9E75', bg: '#E1F5EE' },
  'image/jpeg': { icon: <HiOutlinePhoto />, color: '#BA7517', bg: '#FAEEDA' },
  'image/png': { icon: <HiOutlinePhoto />, color: '#BA7517', bg: '#FAEEDA' },
  'application/zip': { icon: <HiOutlineArchiveBox />, color: '#888780', bg: '#F1EFE8' },
};

function getFileIcon(mimetype: string) {
  if (FILE_ICONS[mimetype]) return FILE_ICONS[mimetype];
  if (mimetype.startsWith('image/')) return { icon: <HiOutlinePhoto />, color: '#BA7517', bg: '#FAEEDA' };
  if (mimetype.includes('javascript') || mimetype.includes('typescript') || mimetype.includes('html') || mimetype.includes('css')) {
    return { icon: <HiOutlineCodeBracket />, color: '#534AB7', bg: '#EEEDFE' };
  }
  return { icon: <HiOutlineDocument />, color: '#888780', bg: '#F1EFE8' };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export const FileCard: React.FC<{ file: any; onDelete?: (id: string) => void }> = ({ file, onDelete }) => {
  const icon = getFileIcon(file.mimetype);
  return (
    <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: icon.bg, color: icon.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.125rem', flexShrink: 0
      }}>
        {icon.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#2C2C2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.originalName}>
          {file.originalName}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#888780', marginTop: '0.125rem' }}>
          {formatBytes(file.sizeBytes)} · v{file.versionNumber}
        </div>
        {file.uploader && (
          <div style={{ fontSize: '0.75rem', color: '#888780' }}>by {file.uploader.name}</div>
        )}
      </div>
      {onDelete && (
        <button onClick={() => onDelete(file.id)} className="btn btn-sm btn-ghost" style={{ color: '#D85A30', padding: '0.25rem' }}>✕</button>
      )}
    </div>
  );
};

export default FileCard;
