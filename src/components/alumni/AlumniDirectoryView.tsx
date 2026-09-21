import React, { useMemo, useState } from 'react';
import {
  Users,
  Search,
  Building2,
  GraduationCap,
  Award,
  ExternalLink,
  GitBranch,
  Globe,
  CheckCircle2,
  Briefcase,
  MapPin
} from 'lucide-react';
import type { Alumni } from '../../api/alumniApi';

interface AlumniDirectoryViewProps {
  alumniList: Alumni[];
  currentAlumni: Alumni;
}

export const AlumniDirectoryView: React.FC<AlumniDirectoryViewProps> = ({
  alumniList,
  currentAlumni
}) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const approvedAlumni = useMemo(() => {
    return alumniList;
  }, [alumniList]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return approvedAlumni.filter((item) => {
      const matchesDept =
        deptFilter === 'ALL' ||
        (item.department && item.department.toLowerCase().includes(deptFilter.toLowerCase()));

      if (!matchesDept) return false;
      if (!query) return true;

      return [
        item.name,
        item.email,
        item.currentCompany,
        item.currentRole,
        item.department,
        item.location
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [approvedAlumni, search, deptFilter]);

  const departments = [
    'ALL',
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Electrical',
    'Mechanical'
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-10">
      {/* Welcoming Hero Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="sp-badge sp-badge-success font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Alumni Network
            </span>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>{approvedAlumni.length} Network Members</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight flex items-center gap-3">
              <Users size={28} className="text-blue-600 shrink-0" />
              Alumni Network Directory
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed font-medium mt-1">
              Connect with fellow graduates, explore industry representations across top tech companies, and foster candidate mentorship opportunities.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, role, skills..."
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {departments.map((dept) => {
          const count =
            dept === 'ALL'
              ? approvedAlumni.length
              : approvedAlumni.filter(
                  (a) =>
                    a.department &&
                    a.department.toLowerCase().includes(dept.toLowerCase())
                ).length;

          return (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                deptFilter === dept
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span>{dept === 'ALL' ? 'All Departments' : dept}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  deptFilter === dept
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Alumni Cards */}
      {filtered.length === 0 ? (
        <div className="sp-card text-center py-16 px-6 text-slate-400">
          <Users size={44} className="mx-auto mb-3 text-slate-300 opacity-50" />
          <h3 className="text-base font-extrabold text-slate-900 font-display">No alumni members found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
            Try broadening your search query or switching department filter options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const isSelf =
              item.id === currentAlumni.id ||
              item.email.toLowerCase() === currentAlumni.email.toLowerCase();

            const initials = item.name
              ? item.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'AL';

            return (
              <div
                key={item.id}
                className={`glass-card p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-5 bg-white shadow-xs hover:shadow-md group ${
                  isSelf
                    ? 'border-blue-300 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 ring-2 ring-white">
                      {initials}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {isSelf && (
                        <span className="sp-badge sp-badge-info text-[10px] font-bold">
                          You
                        </span>
                      )}
                      <span className="sp-badge sp-badge-success text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base font-display leading-tight group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {item.email}
                    </p>
                  </div>

                  {item.bio && (
                    <p className="text-xs text-slate-600 italic line-clamp-2 leading-relaxed bg-blue-50/40 p-3 rounded-xl border border-blue-100/60 font-sans">
                      "{item.bio}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.currentCompany && (
                      <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Building2 size={13} className="text-blue-600" />
                        {item.currentCompany}
                      </span>
                    )}

                    {item.currentRole && (
                      <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <Briefcase size={13} className="text-indigo-600" />
                        {item.currentRole}
                      </span>
                    )}

                    <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <GraduationCap size={13} className="text-slate-500" />
                      Class of {item.graduationYear || 2024}
                    </span>

                    <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Award size={13} className="text-slate-500" />
                      {item.department || 'CSE'}
                    </span>
                  </div>
                </div>

                {/* Social & Dev Links Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.linkedinUrl && (
                      <a
                        href={item.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 transition-all"
                        title="LinkedIn Profile"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-800 transition-all"
                        title="GitHub Profile"
                      >
                        <GitBranch size={14} />
                      </a>
                    )}
                    {item.devToUrl && (
                      <a
                        href={item.devToUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 transition-all"
                        title="Dev.to Blog"
                      >
                        <Globe size={14} />
                      </a>
                    )}
                  </div>

                  {item.location && (
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 truncate">
                      <MapPin size={12} className="text-blue-600 shrink-0" />
                      {item.location}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
