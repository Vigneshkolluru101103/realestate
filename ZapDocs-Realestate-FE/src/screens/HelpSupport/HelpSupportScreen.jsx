import { useState } from 'react';
import {
  Headphones,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  LogIn,
  FileDown,
  Gauge,
  Clock,
  Gift,
  HelpCircle,
  PhoneCall,
  Send,
  CircleCheck,
  Info,
  Play,
  Wrench,
  FileText,
  Upload,
  CreditCard,
  User,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  FAQ_ITEMS,
  VIDEO_GUIDES,
  TROUBLESHOOTING_TIPS
} from '../../mock/helpSupportData';
import Button from '../../components/common/Button/Button';
import GlassSelect from '../../components/common/GlassSelect';
import './HelpSupport.css';

// Icon mapping for Troubleshooting topics
const TROUBLE_ICONS = {
  'tb-1': LogIn,
  'tb-2': FileDown,
  'tb-3': Gauge,
  'tb-4': Clock,
  'tb-5': Gift
};

// Standardized Issue Categories for Callback Request
const ISSUE_CATEGORIES = [
  { value: 'Agreement Creation', label: 'Agreement Creation', icon: FileText },
  { value: 'PDF / Document Upload', label: 'PDF / Document Upload', icon: Upload },
  { value: 'eStamp / eSign', label: 'eStamp / eSign', icon: CircleCheck },
  { value: 'Payment / Billing', label: 'Payment / Billing', icon: CreditCard },
  { value: 'Account / Profile', label: 'Account / Profile', icon: User },
  { value: 'Technical Issue', label: 'Technical Issue', icon: AlertTriangle },
  { value: 'Other', label: 'Other', icon: HelpCircle }
];

// Modern SVG Support Agent Illustration for the Callback Card
function SupportAgentIllustration() {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="zd-support-agent-svg" aria-hidden="true">
      {/* Background Soft Glow */}
      <circle cx="80" cy="70" r="58" fill="url(#agent-glow)" opacity="0.65" />
      
      {/* Speech Bubble */}
      <rect x="96" y="16" width="46" height="30" rx="9" fill="url(#bubble-grad)" />
      <path d="M106 46L102 52L112 46H106Z" fill="#93C5FD" />
      <circle cx="111" cy="31" r="2.5" fill="#2563EB" opacity="0.75" />
      <circle cx="119" cy="31" r="2.5" fill="#2563EB" opacity="0.75" />
      <circle cx="127" cy="31" r="2.5" fill="#2563EB" opacity="0.75" />

      {/* Agent Body / Torso */}
      <path d="M42 124C42 101.909 59.9086 84 82 84C104.091 84 122 101.909 122 124V126C122 128.209 120.209 130 118 130H46C43.7909 130 42 128.209 42 126V124Z" fill="url(#shirt-grad)" />
      <path d="M72 84L82 100L92 84H72Z" fill="#EFF6FF" opacity="0.9" />

      {/* Head & Neck */}
      <rect x="76" y="74" width="12" height="14" rx="4" fill="#F8FAFC" />
      <circle cx="82" cy="56" r="20" fill="url(#head-grad)" />

      {/* Hair */}
      <path d="M64 54C64 45.1634 71.1634 38 80 38C88.8366 38 96 45.1634 96 54C96 55.5 95 58 92 58C89 58 87 53 80 53C73 53 71 58 68 58C65 58 64 55.5 64 54Z" fill="#1E3A8A" />

      {/* Headphones */}
      <path d="M60 56C60 43.8497 69.8497 34 82 34C94.1503 34 104 43.8497 104 56" stroke="#2563EB" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="58" y="50" width="8" height="15" rx="4" fill="#1D4ED8" />
      <rect x="100" y="50" width="8" height="15" rx="4" fill="#1D4ED8" />
      {/* Mic Boom */}
      <path d="M102 61C102 68 96 73 88 73H84" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="83" cy="73" r="2.5" fill="#2563EB" />

      {/* Laptop Base */}
      <path d="M52 118L64 96H100L112 118H52Z" fill="url(#laptop-grad)" />
      <rect x="46" y="118" width="72" height="5" rx="2.5" fill="#1D4ED8" />
      {/* ZapDocs Chevron Logo on Laptop Screen */}
      <path d="M78 103L84 107L80 113H74L80 107L74 103H78Z" fill="#FFFFFF" opacity="0.95" />
      <path d="M86 103L92 107L88 113H82L88 107L82 103H86Z" fill="#93C5FD" opacity="0.85" />

      <defs>
        <radialGradient id="agent-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(80 70) scale(58)">
          <stop stopColor="#3B82F6" stopOpacity="0.25" />
          <stop offset="1" stopColor="#93C5FD" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bubble-grad" x1="96" y1="16" x2="142" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DBEAFE" />
          <stop offset="1" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="head-grad" x1="62" y1="36" x2="102" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="shirt-grad" x1="42" y1="84" x2="122" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="laptop-grad" x1="52" y1="96" x2="112" y2="118" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HelpSupportScreen() {
  const { user } = useAuth();
  const { t, getFaqs } = useLanguage();
  const faqs = getFaqs() || FAQ_ITEMS;

  // Search states: global page search & local FAQ filter
  const [supportSearchQuery, setSupportSearchQuery] = useState('');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqIds, setExpandedFaqIds] = useState(() => new Set(['faq-1'])); // First FAQ expanded by default

  // Troubleshooting accordion state: collapsed by default, only one expanded at a time
  const [expandedTroubleId, setExpandedTroubleId] = useState(null);

  // Callback form state
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackCategory, setCallbackCategory] = useState('');
  const [callbackIssue, setCallbackIssue] = useState('');
  const [callbackErrors, setCallbackErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callbackSubmittedNotice, setCallbackSubmittedNotice] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  function showToast(message) {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3500);
  }

  // Normalized search query for global searching
  const normalizedSupportQuery = supportSearchQuery.toLowerCase().trim();
  const activeFaqQuery = (faqSearchQuery || supportSearchQuery).toLowerCase().trim();

  // Filter Troubleshooting items based on global search query
  const filteredTroubleshooting = TROUBLESHOOTING_TIPS.filter((tip) => {
    if (!normalizedSupportQuery) return true;
    return (
      tip.title.toLowerCase().includes(normalizedSupportQuery) ||
      tip.scenario.toLowerCase().includes(normalizedSupportQuery) ||
      tip.steps.some((step) => step.toLowerCase().includes(normalizedSupportQuery))
    );
  });

  // Filter FAQs based on active search query
  const filteredFaqs = faqs.filter((item) => {
    if (!activeFaqQuery) return true;
    return (
      item.question.toLowerCase().includes(activeFaqQuery) ||
      item.answer.toLowerCase().includes(activeFaqQuery) ||
      item.category.toLowerCase().includes(activeFaqQuery)
    );
  });

  // Toggle single FAQ expansion
  function handleToggleFaq(id) {
    setExpandedFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Toggle Expand All / Collapse All for FAQs
  function handleToggleAllFaqs() {
    const allFilteredFaqsExpanded = filteredFaqs.every((faq) => expandedFaqIds.has(faq.id));
    setExpandedFaqIds(allFilteredFaqsExpanded ? new Set() : new Set(filteredFaqs.map((faq) => faq.id)));
  }

  // Toggle Troubleshooting item expansion
  function handleToggleTrouble(id) {
    setExpandedTroubleId((prev) => (prev === id ? null : id));
  }

  // Validate Callback Form
  function validateCallbackForm() {
    const errors = {};
    if (!callbackName.trim()) {
      errors.name = 'Full Name is required';
    }

    const cleanPhone = callbackPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      errors.phone = 'Mobile Number is required';
    } else if (cleanPhone.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!callbackCategory) {
      errors.category = 'Please select an issue category';
    }

    if (!callbackIssue.trim()) {
      errors.issue = 'Please provide a short description of your issue';
    } else if (callbackIssue.trim().length < 10) {
      errors.issue = 'Issue description must be at least 10 characters long';
    }

    setCallbackErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Handle Callback Form Submit with double-submit prevention
  function handleCallbackSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateCallbackForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setCallbackSubmittedNotice({
        name: callbackName.trim(),
        phone: callbackPhone.trim(),
        category: callbackCategory,
        issue: callbackIssue.trim(),
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });

      setCallbackIssue('');
      setCallbackCategory('');
      setCallbackErrors({});
      setIsSubmitting(false);
      showToast('Callback request recorded (Prototype simulation: not sent to server).');
    }, 400);
  }

  return (
    <div className="zd-help-page">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="zd-help-toast" role="status">
          {feedbackToast}
        </div>
      )}

      {/* 1. Page Header & Large Help Search Bar */}
      <section className="zd-help-header" aria-label="Help & Support Header">
        <div className="zd-help-header-main">
          <div className="zd-help-header-badge" aria-hidden="true">
            <Headphones size={24} color="#2563eb" />
          </div>
          <div className="zd-help-header-text">
            <h1 className="zd-help-header__title">Help &amp; Support</h1>
            <p className="zd-help-header__desc">
              Get answers to your questions, explore step-by-step troubleshooting guides, video walkthroughs, or connect directly with our support team.
            </p>
          </div>
        </div>

        {/* Global Page Search Field */}
        <div className="zd-help-global-search">
          <Search className="zd-help-search-icon" size={17} aria-hidden="true" />
          <input
            type="text"
            className="zd-help-search-input"
            placeholder="Search help, FAQs, and troubleshooting (e.g., e-stamp, quota, login, renew)..."
            value={supportSearchQuery}
            onChange={(e) => setSupportSearchQuery(e.target.value)}
            aria-label="Search help, FAQs, and troubleshooting"
          />
          {supportSearchQuery && (
            <button
              type="button"
              className="zd-help-search-clear"
              onClick={() => setSupportSearchQuery('')}
              aria-label="Clear help search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </section>

      {/* 2. Request a Callback Section (Desktop 2-Col / Tablet & Mobile Responsive) */}
      <section className="zd-callback-center-wrap" aria-label="Request a Callback Section">
        <div className="zd-callback-card zd-glass-card" id="card-request-callback">
          {/* Left Column: Support Agent Graphic + Header + 3 Benefits */}
          <div className="zd-callback-header">
            <div className="zd-callback-header-left">
              <div className="zd-callback-illustration-wrap" aria-hidden="true">
                <SupportAgentIllustration />
              </div>

              <div className="zd-callback-header-content">
                <h2 className="zd-callback-title">Request a Callback</h2>
                <p className="zd-callback-desc">
                  Leave your details and an issue description. Our operations team will reach out to you.
                </p>

                {/* 3 Checkmark Benefits matching Reference */}
                <div className="zd-callback-benefits-list">
                  <div className="zd-callback-benefit-item">
                    <span className="zd-callback-benefit-check" aria-hidden="true">
                      <CircleCheck size={16} />
                    </span>
                    <span className="zd-callback-benefit-text">
                      Get help with your account and agreements
                    </span>
                  </div>
                  <div className="zd-callback-benefit-item">
                    <span className="zd-callback-benefit-check" aria-hidden="true">
                      <CircleCheck size={16} />
                    </span>
                    <span className="zd-callback-benefit-text">
                      Resolve issues with e-Sign, e-Stamp or quota
                    </span>
                  </div>
                  <div className="zd-callback-benefit-item">
                    <span className="zd-callback-benefit-check" aria-hidden="true">
                      <CircleCheck size={16} />
                    </span>
                    <span className="zd-callback-benefit-text">
                      Guidance on billing, renewal and more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Callback Form */}
          <div className="zd-callback-form-panel">
            {/* Submission Feedback Banner */}
            {callbackSubmittedNotice && (
              <div className="zd-callback-success-banner" role="status" id="callback-success-banner">
                <div className="zd-callback-success-icon" aria-hidden="true">
                  <CircleCheck size={20} color="#059669" />
                </div>
                <div className="zd-callback-success-text">
                  <strong className="zd-callback-success-title">
                    Request Recorded (Prototype Simulation)
                  </strong>
                  <p className="zd-callback-success-desc">
                    Thank you, <strong>{callbackSubmittedNotice.name}</strong>. A callback request for category <strong>{callbackSubmittedNotice.category}</strong> (Mobile: {callbackSubmittedNotice.phone}) was simulated at {callbackSubmittedNotice.timestamp}. No real server request was transmitted.
                  </p>
                </div>
                <button
                  type="button"
                  className="zd-callback-success-dismiss"
                  onClick={() => setCallbackSubmittedNotice(null)}
                  aria-label="Dismiss confirmation"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <form onSubmit={handleCallbackSubmit} className="zd-callback-form" noValidate>
              {/* Row 1: Full Name & Mobile Number (2-column grid) */}
              <div className="zd-callback-grid-2col">
                <div className="zd-callback-form-group">
                  <label className="zd-callback-label" htmlFor="zd-callback-name">
                    <span>Full Name</span>
                    <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="zd-callback-name"
                    type="text"
                    className={`zd-callback-input ${callbackErrors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter your full name"
                    value={callbackName}
                    onChange={(e) => {
                      setCallbackName(e.target.value);
                      if (callbackErrors.name) {
                        setCallbackErrors((prev) => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }}
                    required
                  />
                  {callbackErrors.name && (
                    <span className="zd-callback-error" id="err-callback-name" role="alert">
                      {callbackErrors.name}
                    </span>
                  )}
                </div>

                <div className="zd-callback-form-group">
                  <label className="zd-callback-label" htmlFor="zd-callback-phone">
                    <span>Mobile Number</span>
                    <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="zd-callback-phone"
                    type="tel"
                    className={`zd-callback-input ${callbackErrors.phone ? 'is-invalid' : ''}`}
                    placeholder="10-digit mobile number (e.g. 9876543210)"
                    value={callbackPhone}
                    onChange={(e) => {
                      setCallbackPhone(e.target.value);
                      if (callbackErrors.phone) {
                        setCallbackErrors((prev) => {
                          const next = { ...prev };
                          delete next.phone;
                          return next;
                        });
                      }
                    }}
                    required
                  />
                  {callbackErrors.phone && (
                    <span className="zd-callback-error" id="err-callback-phone" role="alert">
                      {callbackErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Issue Category (dropdown via GlassSelect) */}
              <div className="zd-callback-form-group">
                <label className="zd-callback-label" htmlFor="zd-callback-category">
                  <span>Issue Category</span>
                  <span className="req" aria-hidden="true">*</span>
                </label>
                <GlassSelect
                  id="zd-callback-category"
                  name="callbackCategory"
                  value={callbackCategory}
                  placeholder="-- Select an Issue Category --"
                  options={ISSUE_CATEGORIES}
                  onChange={(e, val) => {
                    const selected = val || e?.target?.value || '';
                    setCallbackCategory(selected);
                    if (callbackErrors.category) {
                      setCallbackErrors((prev) => {
                        const next = { ...prev };
                        delete next.category;
                        return next;
                      });
                    }
                  }}
                />
                {callbackErrors.category && (
                  <span className="zd-callback-error" id="err-callback-category" role="alert">
                    {callbackErrors.category}
                  </span>
                )}
              </div>

              {/* Row 3: Issue Description (full-width textarea) */}
              <div className="zd-callback-form-group">
                <label className="zd-callback-label" htmlFor="zd-callback-issue">
                  <span>Issue Description</span>
                  <span className="req" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="zd-callback-issue"
                  rows="4"
                  className={`zd-callback-textarea ${callbackErrors.issue ? 'is-invalid' : ''}`}
                  placeholder="Describe your question or issue in detail..."
                  value={callbackIssue}
                  onChange={(e) => {
                    setCallbackIssue(e.target.value);
                    if (callbackErrors.issue) {
                      setCallbackErrors((prev) => {
                        const next = { ...prev };
                        delete next.issue;
                        return next;
                      });
                    }
                  }}
                  required
                />
                {callbackErrors.issue && (
                  <span className="zd-callback-error" id="err-callback-issue" role="alert">
                    {callbackErrors.issue}
                  </span>
                )}
              </div>

              {/* Prototype Notice */}
              <div className="zd-callback-notice">
                <Info size={16} color="#2563eb" className="zd-callback-notice-icon" aria-hidden="true" />
                <div>
                  <strong>Notice:</strong> This callback form operates in frontend prototype mode. Submissions are simulated locally and are not dispatched to an external CRM or live backend.
                </div>
              </div>

              {/* Submit Button */}
              <div className="zd-callback-action-wrap">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="zd-btn-callback-submit"
                  id="btn-submit-callback"
                >
                  {isSubmitting ? (
                    <>
                      <span className="zd-callback-spinner" aria-hidden="true" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} aria-hidden="true" />
                      <span>Submit Callback Request</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3–4. Knowledge Centre (Quick Troubleshooting & FAQs Side-by-Side) */}
      <div className="zd-support-knowledge-grid">
        {/* Left Column: Quick Troubleshooting */}
        <section className="zd-trouble-section" aria-label="Quick Troubleshooting Section">
          <div className="zd-section-title-row">
            <div className="zd-section-badge-icon" aria-hidden="true">
              <Wrench size={18} />
            </div>
            <div className="zd-section-header-group">
              <h2 className="zd-section-heading">Quick Troubleshooting</h2>
              <p className="zd-section-subheading">
                Step-by-step solutions for common issues. Click any topic below to view actionable steps.
              </p>
            </div>
          </div>

          <div className="zd-trouble-accordion-list" role="region" aria-label="Troubleshooting Topics">
            {filteredTroubleshooting.length === 0 ? (
              <div className="zd-trouble-empty">
                No troubleshooting guides match &ldquo;{supportSearchQuery}&rdquo;.
              </div>
            ) : (
              filteredTroubleshooting.map((tip) => {
                const isExpanded = expandedTroubleId === tip.id;
                const IconComponent = TROUBLE_ICONS[tip.id] || HelpCircle;

                return (
                  <div
                    key={tip.id}
                    className={`zd-trouble-card ${isExpanded ? 'zd-trouble-card--expanded' : ''}`}
                  >
                    <button
                      type="button"
                      className="zd-trouble-header-btn"
                      onClick={() => handleToggleTrouble(tip.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`trouble-body-${tip.id}`}
                      id={`trouble-header-${tip.id}`}
                    >
                      <div className="zd-trouble-header-left">
                        <div className="zd-trouble-icon-box" aria-hidden="true">
                          <IconComponent size={18} />
                        </div>
                        <div className="zd-trouble-title-wrap">
                          <span className="zd-trouble-title">{tip.title}</span>
                          <span className="zd-trouble-scenario-badge">{tip.scenario}</span>
                        </div>
                      </div>
                      <div className="zd-trouble-chevron" aria-hidden="true">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    <div
                      id={`trouble-body-${tip.id}`}
                      role="region"
                      aria-labelledby={`trouble-header-${tip.id}`}
                      aria-hidden={!isExpanded}
                      className="zd-trouble-body"
                    >
                      <div className="zd-trouble-body-inner">
                        <ol className="zd-trouble-steps-list">
                          {tip.steps.map((step, idx) => (
                            <li key={idx} className="zd-trouble-step-item">
                              <span className="zd-trouble-step-num">{idx + 1}</span>
                              <span className="zd-trouble-step-text">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Frequently Asked Questions */}
        <section className="zd-faq-section" aria-label="Frequently Asked Questions">
          <div className="zd-section-title-bar">
            <div className="zd-section-title-row">
              <div className="zd-section-badge-icon" aria-hidden="true">
                <HelpCircle size={18} />
              </div>
              <div className="zd-section-header-group">
                <h2 className="zd-section-heading">{t('faq_title', 'Frequently Asked Questions')}</h2>
                <p className="zd-section-subheading">
                  {t('faq_desc', 'Practical answers regarding onboarding, digital stamp duty, agreement drafting, and quota top-ups.')}
                </p>
              </div>
            </div>

            {/* Local FAQ Search Box & Expand All Toggle */}
            <div className="zd-faq-search-box">
              <Search className="zd-faq-search-icon" size={16} aria-hidden="true" />
              <input
                type="text"
                className="zd-faq-search-input"
                placeholder={t('faq_search_placeholder', 'Search FAQs by keyword (e.g., e-stamp, quota, login, renewal)...')}
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                aria-label="Search FAQs"
              />
              {faqSearchQuery && (
                <button
                  type="button"
                  className="zd-faq-search-clear"
                  onClick={() => setFaqSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Controls: Count & Expand All Toggle */}
          <div className="zd-faq-accordion-controls">
            <span>
              {t('faq_showing_prefix', 'Showing')} {filteredFaqs.length} {t('faq_of', 'of')} {faqs.length} {t('faq_questions', 'questions')}
            </span>
            {filteredFaqs.length > 0 && (
              <button
                type="button"
                className="zd-faq-toggle-all-btn"
                onClick={handleToggleAllFaqs}
              >
                {filteredFaqs.every((faq) => expandedFaqIds.has(faq.id)) ? t('faq_collapse_all', 'Collapse All') : t('faq_expand_all', 'Expand All')}
              </button>
            )}
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div className="zd-faq-empty">
              <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', fontSize: '14px' }}>
                No matching questions found
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', maxWidth: '400px' }}>
                No FAQ items matched your query &ldquo;{faqSearchQuery || supportSearchQuery}&rdquo;. Try another keyword or clear the search.
              </div>
              <Button variant="secondary" size="sm" onClick={() => { setFaqSearchQuery(''); setSupportSearchQuery(''); }}>
                Clear FAQ Search
              </Button>
            </div>
          ) : (
            <div className="zd-faq-list" role="region" aria-label="FAQ Accordion">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqIds.has(faq.id);
                return (
                  <div
                    key={faq.id}
                    className={`zd-faq-item ${isExpanded ? 'zd-faq-item--expanded' : ''}`}
                  >
                    <button
                      type="button"
                      className="zd-faq-question-btn"
                      onClick={() => handleToggleFaq(faq.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${faq.id}`}
                      id={`faq-header-${faq.id}`}
                    >
                      <span className="zd-faq-category-tag">{faq.category}</span>
                      <div className="zd-faq-question-content">
                        <span className="zd-faq-question-text">{faq.question}</span>
                        <span className="zd-faq-icon-indicator" aria-hidden="true">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </div>
                    </button>

                    <div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-header-${faq.id}`}
                      aria-hidden={!isExpanded}
                      className="zd-faq-answer-panel"
                    >
                      <div className="zd-faq-answer-inner">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 5. Quick Video Guides (Responsive 5/4/2/1 Grid matching references) */}
      <section className="zd-videos-section" aria-label="Quick Video Guides">
        <div className="zd-section-title-row">
          <div className="zd-section-badge-icon" aria-hidden="true">
            <Play size={18} fill="#2563eb" color="#2563eb" />
          </div>
          <div className="zd-section-header-group">
            <h2 className="zd-section-heading">Quick Video Guides</h2>
            <p className="zd-section-subheading">
              Visual walkthroughs to guide you through registration, agreement creation, client records, and quota management.
            </p>
          </div>
        </div>

        <div className="zd-videos-grid">
          {VIDEO_GUIDES.map((vid) => (
            <article key={vid.id} className={`zd-video-card ${vid.hasPlayableVideo ? '' : 'zd-video-card--unavailable'}`}>
              <div className="zd-video-placeholder-box">
                <div className="zd-video-play-circle" aria-hidden="true">
                  <Play size={20} fill="#2563eb" color="#2563eb" />
                </div>
                <span className="zd-video-placeholder-badge">
                  {vid.hasPlayableVideo ? 'Available' : 'Coming Soon'}
                </span>
              </div>

              <div className="zd-video-card-body">
                <div className="zd-video-meta-row">
                  <span className="zd-video-category-badge">{vid.category}</span>
                  <span className="zd-video-duration">{vid.duration}</span>
                </div>
                <div className="zd-video-title">{vid.title}</div>
                <div className="zd-video-desc">{vid.description}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Compliance Notice (Restored compact bottom panel matching Reference 1, 2, 3) */}
      <section className="zd-help-disclaimer" aria-label="Support Disclaimer">
        <Info size={18} aria-hidden="true" />
        <p><strong>Help &amp; Support Compliance Notice:</strong> Guidance, troubleshooting resolutions, and video placeholders presented in this section reflect current prototype features. No automated tickets or live callback dispatches are processed in this frontend.</p>
      </section>
    </div>
  );
}
