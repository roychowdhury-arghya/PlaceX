import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ExternalLink,
  Mail,
  Search,
  UsersRound,
  Building2,
  GraduationCap,
  Award,
  MapPin,
  GitBranch,
  Globe,
  CheckCircle2,
  X,
  Briefcase
} from 'lucide-react';

import type { Alumni, Blog, Referral } from '../../api/alumniApi';

interface StudentAlumniViewProps {
  blogs: Blog[];
  referrals: Referral[];
  alumni: Alumni[];
}

type BlogCategory =
  | 'Interview Experience'
  | 'Career Advice'
  | 'Referral Tips'
  | 'General';

const BLOG_CATEGORIES: Array<'All' | BlogCategory> = [
  'All',
  'Interview Experience',
  'Career Advice',
  'Referral Tips',
  'General'
];

export const StudentAlumniView: React.FC<StudentAlumniViewProps> = ({
  blogs,
  referrals,
  alumni
}) => {
  const [activeSection, setActiveSection] = useState<'blogs' | 'referrals' | 'directory'>(
    'blogs'
  );

  const [selectedCategory, setSelectedCategory] = useState<
    'All' | BlogCategory
  >('All');

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);

  /*
   * Only published blogs are visible to students.
   */
  const publishedBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return blogs.filter((blog) => {
      if (!blog.published) return false;

      const categoryMatches =
        selectedCategory === 'All' ||
        blog.category === selectedCategory;

      if (!categoryMatches) return false;

      if (!query) return true;

      return (
        blog.title.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query)
      );
    });
  }, [blogs, selectedCategory, searchQuery]);

  /*
   * Approved alumni directory list for students.
   */
  const approvedAlumniList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return alumni.filter((item) => {
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
  }, [alumni, searchQuery]);

  const getAlumni = (alumniId: string) => {
    return alumni.find((item) => item.id === alumniId);
  };

  const getAuthorName = (blog: Blog) => {
    const author = getAlumni(blog.alumniId);
    return author?.name || 'Alumni';
  };

  const getAuthorCompany = (blog: Blog) => {
    const author = getAlumni(blog.alumniId);
    return author?.currentCompany || 'Professional';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  };

  const formatDate = (date: string) => {
    if (!date) return 'Date unavailable';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'Interview Experience':
        return 'student-alumni-category interview';
      case 'Career Advice':
        return 'student-alumni-category career';
      case 'Referral Tips':
        return 'student-alumni-category referral';
      default:
        return 'student-alumni-category general';
    }
  };

  return (
    <section className="student-alumni-page">
      {/* Header */}
      <div className="student-alumni-header">
        <div>
          <div className="student-alumni-eyebrow">
            <UsersRound size={16} />
            Alumni Network
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight flex items-center gap-3">
            Learn from your Alumni
          </h1>

          <p>
            Read career experiences, interview advice, explore candidate referral openings, and connect directly with verified alumni.
          </p>
        </div>

        <div className="student-alumni-header-icon">
          <GraduationCapIcon />
        </div>
      </div>

      {/* Statistics */}
      <div className="student-alumni-stats">
        <div className="student-alumni-stat-card">
          <div className="student-alumni-stat-icon blue">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Published Blogs</span>
            <strong>{blogs.filter((blog) => blog.published).length}</strong>
          </div>
        </div>

        <div className="student-alumni-stat-card">
          <div className="student-alumni-stat-icon green">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <span>Active Referrals</span>
            <strong>{referrals.filter((referral) => referral.active).length}</strong>
          </div>
        </div>

        <div className="student-alumni-stat-card">
          <div className="student-alumni-stat-icon amber">
            <UsersRound size={20} />
          </div>

          <div>
            <span>Verified Alumni</span>
            <strong>{approvedAlumniList.length}</strong>
          </div>
        </div>
      </div>

      {/* Section Switcher */}
      <div className="student-alumni-toolbar">
        <div className="student-alumni-tabs">
          <button
            type="button"
            className={activeSection === 'blogs' ? 'active' : ''}
            onClick={() => {
              setActiveSection('blogs');
              setSearchQuery('');
            }}
          >
            <BookOpen size={17} />
            Alumni Blogs
          </button>

          <button
            type="button"
            className={activeSection === 'referrals' ? 'active' : ''}
            onClick={() => {
              setActiveSection('referrals');
              setSearchQuery('');
            }}
          >
            <BriefcaseBusiness size={17} />
            Referral Opportunities
          </button>

          <button
            type="button"
            className={activeSection === 'directory' ? 'active' : ''}
            onClick={() => {
              setActiveSection('directory');
              setSearchQuery('');
            }}
          >
            <UsersRound size={17} />
            Alumni Directory ({approvedAlumniList.length})
          </button>
        </div>

        <div className="student-alumni-search">
          <Search size={17} />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              activeSection === 'blogs'
                ? 'Search blogs...'
                : activeSection === 'referrals'
                ? 'Search company or role...'
                : 'Search alumni name, company, role...'
            }
          />
        </div>
      </div>

      {/* BLOGS */}
      {activeSection === 'blogs' && (
        <>
          {/* Category Filter */}
          <div className="student-alumni-filter-row">
            <div className="student-alumni-filter-label">
              <span>Filter by category</span>

              <div className="student-alumni-select-wrapper">
                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(
                      event.target.value as 'All' | BlogCategory
                    )
                  }
                >
                  {BLOG_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown size={16} />
              </div>
            </div>

            <span className="student-alumni-result-count">
              {publishedBlogs.length}{' '}
              {publishedBlogs.length === 1 ? 'blog' : 'blogs'}
            </span>
          </div>

          {publishedBlogs.length === 0 ? (
            <EmptyState
              icon={<BookOpen size={30} />}
              title="No published blogs found"
              description={
                searchQuery || selectedCategory !== 'All'
                  ? 'Try changing your search or category filter.'
                  : 'Alumni have not published any blogs yet.'
              }
            />
          ) : (
            <div className="student-alumni-blog-grid">
              {publishedBlogs.map((blog) => {
                return (
                  <article
                    key={blog.id}
                    className="student-alumni-blog-card"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <div className="student-alumni-blog-meta">
                      <span className={getCategoryClass(blog.category)}>
                        {blog.category}
                      </span>

                      <span>{formatDate(blog.postedDate)}</span>
                    </div>

                    <h2>{blog.title}</h2>

                    <p className="student-alumni-blog-excerpt">
                      {blog.content}
                    </p>

                    <div className="student-alumni-blog-footer">
                      <div className="student-alumni-author-info">
                        <div className="student-alumni-avatar">
                          {getInitials(getAuthorName(blog))}
                        </div>

                        <div>
                          <strong>{getAuthorName(blog)}</strong>
                          <span>{getAuthorCompany(blog)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="student-alumni-read-more"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedBlog(blog);
                        }}
                      >
                        Read Article →
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* REFERRALS */}
      {activeSection === 'referrals' && (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-rose-50 border-2 border-rose-300 text-center gap-3 my-4 animate-fade-in shadow-xs">
          <h2 className="text-2xl sm:text-4xl font-black text-rose-600 font-display tracking-tight uppercase">
            referral is not available now , the feature is coming soon
          </h2>
        </div>
      )}

      {/* ALUMNI DIRECTORY */}
      {activeSection === 'directory' && (
        <>
          {approvedAlumniList.length === 0 ? (
            <EmptyState
              icon={<UsersRound size={30} />}
              title="No alumni members found"
              description={
                searchQuery
                  ? 'Try searching for a different name, company, or role.'
                  : 'No verified alumni members available in directory.'
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {approvedAlumniList.map((item) => {
                const initials = item.name
                  ? item.name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'AL';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAlumni(item)}
                    className="glass-card p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 cursor-pointer group"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 ring-2 ring-white">
                          {initials}
                        </div>

                        <span className="sp-badge sp-badge-success text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 size={11} /> Verified Alumni
                        </span>
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

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-xs text-blue-600 font-bold group-hover:underline flex items-center gap-1">
                        View Profile & Credentials →
                      </span>

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
        </>
      )}

      {/* Full Blog Modal */}
      {selectedBlog && (
        <div
          className="student-alumni-modal-backdrop"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="student-alumni-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="student-alumni-modal-header">
              <div>
                <span
                  className={getCategoryClass(selectedBlog.category)}
                >
                  {selectedBlog.category}
                </span>

                <h2>{selectedBlog.title}</h2>

                <div className="student-alumni-modal-author">
                  <div className="student-alumni-avatar">
                    {getInitials(getAuthorName(selectedBlog))}
                  </div>

                  <div>
                    <strong>{getAuthorName(selectedBlog)}</strong>
                    <span>
                      {getAuthorCompany(selectedBlog)} ·{' '}
                      {formatDate(selectedBlog.postedDate)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="student-alumni-modal-close"
                onClick={() => setSelectedBlog(null)}
                aria-label="Close blog"
              >
                ×
              </button>
            </div>

            <div className="student-alumni-modal-content">
              {selectedBlog.content.split('\n').map((paragraph, index) => (
                <p key={`${selectedBlog.id}-paragraph-${index}`}>
                  {paragraph || '\u00A0'}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Alumni Profile Modal */}
      {selectedAlumni && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedAlumni(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative animate-scale-up border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Top Banner */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 ring-4 ring-white">
                {getInitials(selectedAlumni.name || 'Alumni')}
              </div>

              <div className="flex flex-col gap-1 pr-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display leading-tight">
                    {selectedAlumni.name}
                  </h2>
                  <span className="sp-badge sp-badge-success text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Verified Alumni
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {selectedAlumni.email}
                </p>
              </div>
            </div>

            {/* Career & Organization Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Organization</span>
                  <strong className="text-xs sm:text-sm text-slate-900 font-bold">{selectedAlumni.currentCompany || 'N/A'}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Job Designation</span>
                  <strong className="text-xs sm:text-sm text-slate-900 font-bold">{selectedAlumni.currentRole || 'N/A'}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Graduation Class</span>
                  <strong className="text-xs sm:text-sm text-slate-900 font-bold">Class of {selectedAlumni.graduationYear || 2024}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">City Location</span>
                  <strong className="text-xs sm:text-sm text-slate-900 font-bold">{selectedAlumni.location || 'Remote / N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Alumni Bio / Mentoring Focus */}
            {selectedAlumni.bio && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display">
                  Alumni Career Bio & Mentoring Focus
                </h4>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans bg-blue-50/50 p-4 rounded-2xl border border-blue-100/70">
                  {selectedAlumni.bio}
                </div>
              </div>
            )}

            {/* Developer Portfolios & Social Links */}
            <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-display">
                Professional & Developer Portfolio Links
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {selectedAlumni.linkedinUrl && (
                  <a
                    href={selectedAlumni.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs transition-all flex items-center gap-2 border border-blue-100"
                  >
                    <ExternalLink size={15} />
                    LinkedIn Profile
                  </a>
                )}

                {selectedAlumni.githubUrl && (
                  <a
                    href={selectedAlumni.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-800 font-bold text-xs transition-all flex items-center gap-2 border border-slate-200"
                  >
                    <GitBranch size={15} />
                    GitHub Portfolio
                  </a>
                )}

                {selectedAlumni.hashNodeUrl && (
                  <a
                    href={selectedAlumni.hashNodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs transition-all flex items-center gap-2 border border-indigo-100"
                  >
                    <Globe size={15} />
                    Hashnode Blog
                  </a>
                )}

                {selectedAlumni.devToUrl && (
                  <a
                    href={selectedAlumni.devToUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 font-bold text-xs transition-all flex items-center gap-2 border border-slate-200"
                  >
                    <Globe size={15} />
                    Dev.to Profile
                  </a>
                )}

                {selectedAlumni.email && (
                  <a
                    href={`mailto:${selectedAlumni.email}`}
                    className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-xs transition-all flex items-center gap-2 border border-emerald-100"
                  >
                    <Mail size={15} />
                    Contact Alumni
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const GraduationCapIcon = () => (
  <div className="student-alumni-graduation-icon">
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
      <path d="M22 10v6" />
    </svg>
  </div>
);

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="student-alumni-empty-state">
      <div className="student-alumni-empty-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
};