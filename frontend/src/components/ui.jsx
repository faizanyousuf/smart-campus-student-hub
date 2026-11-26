import Icon from './Icon.jsx';

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="page-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-desc">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function ErrorBox({ message }) {
  if (!message) return null;

  return (
    <div className="error-box" role="alert">
      <Icon name="alert" size={16} />
      <span>{message}</span>
    </div>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="empty">
      <Icon name="box" size={22} />
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export function statusTone(status = '') {
  const value = String(status).toUpperCase();

  if (['OPEN', 'PENDING', 'UNASSIGNED'].includes(value)) return 'amber';
  if (['IN_PROGRESS', 'MATCHED', 'PROCESSING'].includes(value)) return 'blue';
  if (['APPROVED', 'RESOLVED', 'RETURNED', 'CLAIMED'].includes(value)) return 'green';
  if (['REJECTED', 'CLOSED'].includes(value)) return 'rose';
  return 'neutral';
}

export function categoryTone(category = '') {
  const value = String(category).toUpperCase();

  if (value === 'URGENT') return 'rose';
  if (value === 'ACADEMIC') return 'violet';
  if (value === 'EVENT') return 'blue';
  return 'neutral';
}
