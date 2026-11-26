import Icon from './Icon.jsx';

const features = [
  { icon: 'shield', label: 'Secure JWT access' },
  { icon: 'notice', label: 'Campus notices' },
  { icon: 'box', label: 'Lost & found' }
];

export default function AuthShell({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <div className="auth-aside-brand">
          <div className="brand-mark">
            <Icon name="spark" size={21} />
          </div>
          <div>
            <div className="brand-name">Smart Campus</div>
            <div className="brand-sub">Student Hub</div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Your campus workspace</p>
          <h1>
            Everything campus, <span>one clean workspace.</span>
          </h1>
          <p>
            Stay on top of announcements, raise support requests and reunite
            lost belongings — all from one secure student hub.
          </p>
          <div className="auth-features">
            {features.map((feature) => (
              <span className="auth-feature" key={feature.label}>
                <Icon name={feature.icon} size={14} />
                {feature.label}
              </span>
            ))}
          </div>
        </div>

        <div className="auth-aside-footer">Smart Campus Student Hub · Secure access</div>
      </aside>

      <main className="auth-main">{children}</main>
    </div>
  );
}
