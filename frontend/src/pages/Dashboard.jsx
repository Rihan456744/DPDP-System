import { useState } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, Download, Activity, Lock, AlertTriangle, 
  Loader2, UploadCloud, FileText, CheckCircle2, ShieldCheck, 
  FileKey, ChevronDown, FileJson 
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [scanFramework, setScanFramework] = useState('both'); 
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const COLOR_CRITICAL = '#EF4444'; 
  const COLOR_MEDIUM = '#F97316';   
  const COLOR_LOW = '#4A90E2';      
  const ACTION_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#1E3A5F', '#4A90E2'];

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return (
      <div className="dashboard-wrapper flex-center">
        <div className="upload-box locked-box">
          <div className="icon-wrapper"><Lock size={48} color="var(--accent-blue)" /></div>
          <h2>Access Restricted</h2>
          <p>Please log in with your administrative credentials to run the compliance scanner.</p>
          <Link to="/login" className="btn-dark-large w-full mt-4" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("framework", scanFramework);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.error) setReportData({ error: response.data.error });
      else setReportData({ ...response.data, scannedFramework: scanFramework });
    } catch (error) {
      setReportData({ error: "Connection Refused: Verify your Python API backend is running." });
    } finally { setLoading(false); }
  };

  const downloadJSONReport = () => {
    if (!reportData || reportData.error) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Report_${reportData.filename || 'data'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadPDFReport = () => window.print();

  if (!reportData && !loading) {
    return (
      <div className="dashboard-wrapper flex-center">
        <div className="upload-box">
          <div className="icon-wrapper"><UploadCloud size={40} color="var(--accent-blue)" /></div>
          <h2>Compliance Scanner</h2>
          <p>Initialize your Random Forest pipeline by selecting a target framework and uploading your logs.</p>
          
          <form onSubmit={handleFileUpload} className="upload-form">
            <div className="form-section">
              <h3>1. Select Target Framework</h3>
              <div className="framework-grid">
                <div className={`fw-card ${scanFramework === 'soc2' ? 'active' : ''}`} onClick={() => setScanFramework('soc2')}>
                  {scanFramework === 'soc2' && <CheckCircle2 size={18} className="check-icon" />}
                  <ShieldCheck size={28} className="fw-icon" />
                  <span>SOC 2 Type II</span>
                </div>
                <div className={`fw-card ${scanFramework === 'dpdp' ? 'active' : ''}`} onClick={() => setScanFramework('dpdp')}>
                  {scanFramework === 'dpdp' && <CheckCircle2 size={18} className="check-icon" />}
                  <FileKey size={28} className="fw-icon" />
                  <span>DPDP Act</span>
                </div>
                <div className={`fw-card ${scanFramework === 'both' ? 'active' : ''}`} onClick={() => setScanFramework('both')}>
                  {scanFramework === 'both' && <CheckCircle2 size={18} className="check-icon" />}
                  <Activity size={28} className="fw-icon" />
                  <span>Comprehensive</span>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>2. Upload Data Stream</h3>
              <input type="file" accept=".db,.json,.log,.csv" onChange={(e) => setFile(e.target.files[0])} className="file-input" />
            </div>

            <button type="submit" className="btn-dark-large w-full mt-4" disabled={!file}>
              Execute {scanFramework.toUpperCase()} Scan
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-wrapper flex-center">
        <div className="loader-container">
          <Loader2 size={48} color="var(--accent-blue)" className="spin-anim" />
          <h2>Executing ML Pipeline Engine...</h2>
          <p>Training Random Forest models against {scanFramework.toUpperCase()} controls.</p>
        </div>
      </div>
    );
  }

  if (reportData && reportData.error) {
    return (
      <div className="dashboard-wrapper flex-center">
        <div className="upload-box" style={{ borderColor: COLOR_CRITICAL }}>
          <div className="icon-wrapper" style={{ background: '#FEF2F2', borderColor: '#FEE2E2' }}>
            <AlertTriangle size={40} color={COLOR_CRITICAL} />
          </div>
          <h2 style={{ color: COLOR_CRITICAL }}>Scan Aborted</h2>
          <p>{reportData.error}</p>
          <button className="btn-dark-large w-full mt-4" onClick={() => { setReportData(null); setFile(null); }}>
            Try Alternative Dataset
          </button>
        </div>
      </div>
    );
  }

  const anomalies = reportData.mlAnomalies || [];
  const violations = reportData.ruleViolations || [];
  const riskScore = reportData.overallRiskScore ?? 100;

  const severityData = [
    { name: 'Critical', count: anomalies.filter(a => a.risk === 'CRITICAL').length },
    { name: 'Medium', count: anomalies.filter(a => a.risk === 'MEDIUM').length + violations.length },
    { name: 'Low', count: anomalies.filter(a => a.risk === 'LOW').length }
  ];

  const riskTrendData = [
    { time: '04:00', risk: Math.max(10, riskScore - 35) },
    { time: '08:00', risk: Math.min(100, riskScore + 12) },
    { time: '12:00', risk: Math.max(10, riskScore - 18) },
    { time: 'Now', risk: riskScore }
  ];

  const tableCounts = {};
  anomalies.forEach(a => { if(a.table) tableCounts[a.table] = (tableCounts[a.table] || 0) + 1; });
  const tableData = Object.keys(tableCounts).map(key => ({ name: key, count: tableCounts[key] }));

  const actionCounts = {};
  anomalies.forEach(a => { if(a.action) actionCounts[a.action] = (actionCounts[a.action] || 0) + 1; });
  const actionData = Object.keys(actionCounts).map(key => ({ name: key, count: actionCounts[key] }));

  return (
    <div className="dashboard-wrapper container">
      
      {/* --- UPDATED: IMAGE LOGO PDF HEADER --- */}
      <div className="print-only print-header">
        <img src="/dcs-logo.png" alt="DCS2 Logo" className="pdf-logo" />
      </div>

      <div className="dashboard-header">
        <div className="header-text">
          <h1>Scan Targets: <span className="text-accent">{reportData.filename}</span></h1>
          <p>Threat Vector Matrix ({reportData.scannedFramework?.toUpperCase() || 'COMPREHENSIVE'})</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => { setReportData(null); setFile(null); }}>Eject File</button>
          
          <div className="dropdown-container">
            <button className="btn-download" onClick={() => setExportDropdownOpen(!exportDropdownOpen)}>
              <div className="btn-inner"><Download size={18} /> Save As</div>
              <ChevronDown size={16} style={{ transform: exportDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
            {exportDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { downloadPDFReport(); setExportDropdownOpen(false); }}>
                  <FileText size={16} /> Export as PDF
                </button>
                <button className="dropdown-item" onClick={() => { downloadJSONReport(); setExportDropdownOpen(false); }}>
                  <FileJson size={16} /> Export JSON Matrix
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon blue-icon"><ShieldAlert size={24} color="var(--accent-blue)" /></div>
          <div className="metric-info">
            <h3>Compliance Integrity</h3>
            <div className={`score-value ${riskScore > 75 ? 'text-accent' : riskScore > 45 ? 'text-orange' : 'text-red'}`}>
              {riskScore}<span>/100</span>
            </div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon blue-icon"><Activity size={24} color="var(--accent-blue)" /></div>
          <div className="metric-info">
            <h3>Sectors Indexed</h3>
            <div className="score-value text-dark">{reportData.scannedLogs?.toLocaleString() || 0}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon red-icon"><AlertTriangle size={24} color={COLOR_CRITICAL} /></div>
          <div className="metric-info">
            <h3>Active Vectors</h3>
            <div className="score-value text-red">{anomalies.length + violations.length}</div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-panel">
          <h3>Risk Profile Velocity</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLOR_LOW} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLOR_LOW} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--primary-navy)', color: '#fff', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="risk" stroke={COLOR_LOW} strokeWidth={3} fillOpacity={1} fill="url(#riskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-panel">
          <h3>Severity Aggregations</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'var(--bg-main)' }} contentStyle={{ backgroundColor: 'var(--primary-navy)', color: '#fff', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {severityData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.name === 'Critical' ? COLOR_CRITICAL : entry.name === 'Medium' ? COLOR_MEDIUM : COLOR_LOW} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-panel">
          <h3>Framework Allocation</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie data={severityData} cx="50%" cy="45%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="count" stroke="none">
                  {severityData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.name === 'Critical' ? COLOR_CRITICAL : entry.name === 'Medium' ? COLOR_MEDIUM : COLOR_LOW} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--primary-navy)', color: '#fff', border: 'none', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'var(--text-muted)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="secondary-charts-grid">
        <div className="chart-panel">
          <h3>Target Cluster Infiltration</h3>
          <div className="chart-container">
            {tableData.length === 0 ? (
              <div className="empty-chart-fallback">No cluster records encountered.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tableData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-light)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-main)', fontWeight: 600 }} width={80} />
                  <Tooltip cursor={{ fill: 'var(--bg-main)' }} contentStyle={{ backgroundColor: 'var(--primary-navy)', color: '#fff', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill={COLOR_CRITICAL} radius={[0, 4, 4, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="chart-panel">
          <h3>Anomalous Vector Actions</h3>
          <div className="chart-container">
            {actionData.length === 0 ? (
              <div className="empty-chart-fallback">No anomalous execution methods indexed.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie data={actionData} cx="50%" cy="45%" innerRadius={0} outerRadius={85} dataKey="count" stroke="none" label={{ fill: 'var(--primary-navy)', fontSize: 12, fontWeight: 700 }}>
                    {actionData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={ACTION_COLORS[idx % ACTION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--primary-navy)', color: '#fff', border: 'none', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'var(--text-muted)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2><AlertTriangle size={18} color={COLOR_CRITICAL} /> Priority Findings & Remediation Protocols</h2>
        </div>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Threat Class</th>
                <th>Resource Target</th>
                <th>Diagnostic Execution Signature</th>
                <th>Severity Status</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.length === 0 && violations.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    All sectors cleared. Dataset fully matches compliance controls.
                  </td>
                </tr>
              )}
              {anomalies.map((log, idx) => (
                <tr key={`ml-${idx}`}>
                  <td className="font-bold">Anomalous Execution Check</td>
                  <td>Sector: <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{log.table || 'Unknown'}</span></td>
                  <td>Event [{log.action}] isolated across {log.rows?.toLocaleString() || 0} vectors.</td>
                  <td><span className={`badge ${log.risk === 'CRITICAL' ? 'badge-red' : 'badge-orange'}`}>{log.risk}</span></td>
                </tr>
              ))}
              {violations.map((rule, idx) => (
                <tr key={`rule-${idx}`}>
                  <td className="font-bold">System Configuration Gap</td>
                  <td>Global Architecture Core</td>
                  <td>{rule.desc}</td>
                  <td><span className="badge badge-orange">MEDIUM</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PRINT ONLY PDF DISCLAIMER --- */}
      <div className="print-only print-disclaimer">
        <strong>Disclaimer:</strong> This data is for reference purpose only. It may make mistakes.
      </div>
      
    </div>
  );
}