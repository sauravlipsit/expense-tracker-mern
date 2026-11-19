import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleHelp, ChevronDown, LogOut, Wallet, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth(); const navigate = useNavigate(); const [menuOpen, setMenuOpen] = useState(false);
  const signOut = async () => { await logout(); navigate('/login'); };
  return <div className="app-shell"><header className="topbar"><div className="brand"><span className="brand-mark"><Wallet size={19}/></span><span>spendwise</span></div><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button><nav className={menuOpen ? 'top-nav open' : 'top-nav'}><a className="nav-link active" href="/dashboard">Overview</a></nav><div className="top-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={19}/></button><div className="profile"><div className="avatar">{user?.name?.slice(0,1).toUpperCase() || 'U'}</div><div className="profile-copy"><strong>{user?.name}</strong><span>Personal account</span></div><ChevronDown size={15} className="muted"/><button className="logout-button" onClick={signOut} title="Sign out"><LogOut size={17}/></button></div></div></header><main className="main-content">{children}</main><footer className="app-footer"><span>© 2026 Spendwise, Inc.</span><span>Secure personal finance workspace</span></footer></div>;
}
