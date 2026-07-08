import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiTrello,
  FiTarget,
  FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';
import Button from '../../components/common/Button';

const Landing = () => {
  return (
    <div className="landing">
      <div className="container">
        <nav className="landing-nav">
          <div className="landing-nav__brand">
            <span className="landing-nav__brand-mark" />
            SyncSpace
          </div>
          <div className="landing-nav__actions">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Get started</Button>
            </Link>
          </div>
        </nav>

        <section className="landing-hero">
          <div>
            <span className="landing-hero__eyebrow">
              <FiCheckCircle size={13} />
              Built for small, focused teams
            </span>
            <h1>
              Keep every project <span>in sync.</span>
            </h1>
            <p className="landing-hero__lede">
              SyncSpace brings your teams, projects, and tasks into one calm workspace —
              so nothing gets lost between a chat message and a to-do list.
            </p>
            <div className="landing-hero__actions">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={<FiArrowRight />}>
                  Start for free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  I already have an account
                </Button>
              </Link>
            </div>
            <div className="landing-hero__meta">
              <div className="landing-hero__meta-item">
                <span className="landing-hero__meta-value">3</span>
                <span className="landing-hero__meta-label">Core modules</span>
              </div>
              <div className="landing-hero__meta-item">
                <span className="landing-hero__meta-value">100%</span>
                <span className="landing-hero__meta-label">Free to use</span>
              </div>
              <div className="landing-hero__meta-item">
                <span className="landing-hero__meta-value">&lt;1min</span>
                <span className="landing-hero__meta-label">To invite a teammate</span>
              </div>
            </div>
          </div>

          <div className="hero-mockup">
            <div className="hero-mockup__float hero-mockup__float--one">
              <FiUsers color="var(--color-primary)" />
              4 teammates synced
            </div>

            <div className="hero-mockup__frame">
              <div className="hero-mockup__titlebar">
                <span className="hero-mockup__dot" style={{ background: '#e15554' }} />
                <span className="hero-mockup__dot" style={{ background: '#dba62c' }} />
                <span className="hero-mockup__dot" style={{ background: '#2e9e6d' }} />
              </div>
              <div className="hero-mockup__body">
                <div className="hero-mockup__col">
                  <span className="hero-mockup__col-label">Todo</span>
                  <div className="hero-mockup__chip">
                    Wireframe onboarding
                    <div className="hero-mockup__chip-bar" style={{ background: 'var(--color-border-strong)' }} />
                  </div>
                  <div className="hero-mockup__chip">
                    Draft API contracts
                    <div className="hero-mockup__chip-bar" style={{ background: 'var(--color-border-strong)' }} />
                  </div>
                </div>
                <div className="hero-mockup__col">
                  <span className="hero-mockup__col-label">In Progress</span>
                  <div className="hero-mockup__chip">
                    Build Kanban board
                    <div className="hero-mockup__chip-bar" style={{ background: 'var(--color-primary)' }} />
                  </div>
                </div>
                <div className="hero-mockup__col">
                  <span className="hero-mockup__col-label">Done</span>
                  <div className="hero-mockup__chip">
                    Set up auth
                    <div className="hero-mockup__chip-bar" style={{ background: 'var(--color-success)' }} />
                  </div>
                  <div className="hero-mockup__chip">
                    Invite the team
                    <div className="hero-mockup__chip-bar" style={{ background: 'var(--color-success)' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-mockup__float hero-mockup__float--two">
              <FiTarget color="var(--color-accent-dark)" />
              Sprint 68% complete
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-section__header">
            <span className="badge badge-status-inprogress">How it works</span>
            <h2 style={{ marginTop: 'var(--space-3)' }}>Three modules, one flow</h2>
            <p>Create a team, spin up a project inside it, then break the work into tasks your team can move across a board.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-card__icon">
                <FiUsers />
              </div>
              <h3>Teams</h3>
              <p>Create a team and share an invite code so teammates can join in seconds — no email chains required.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-dark)' }}>
                <FiTarget />
              </div>
              <h3>Projects</h3>
              <p>Group related work under a project with a clear owner and deadline, so every team always knows what's next.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                <FiTrello />
              </div>
              <h3>Task board</h3>
              <p>Drag tasks between Todo, In Progress, and Done, with priorities and due dates that keep the board honest.</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <h2>Bring your team into one workspace</h2>
          <p>It takes less than a minute to create your first team.</p>
          <Link to="/register">
            <Button variant="secondary" size="lg" style={{ backgroundColor: '#ffffff' }}>
              Create your workspace
            </Button>
          </Link>
        </section>

        <footer className="landing-footer">
          <span>© {new Date().getFullYear()} SyncSpace</span>
          <span>A collaborative workspace for teams</span>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
