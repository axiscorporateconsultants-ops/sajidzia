import React, { useState, useEffect } from 'react';
import { SajidZiaLogo, IcapPakistanLogo, SzcEmblem, SzcLetterheadBrand, IcapLetterheadLogo } from './components/Logos';

type TabType = 'tab-home' | 'tab-about-firm' | 'tab-services' | 'tab-about-us';
type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY_INQUIRY = {
  name: '',
  email: '',
  service: 'Audit & Assurance',
  message: '',
};

const FIRM_CONTACTS = {
  address: '227-C, First Floor, Johar Town, Lahore, Punjab, Pakistan',
  addressShort: '227-C, First Floor, Johar Town, Lahore',
  mapsUrl: 'https://maps.app.goo.gl/aGEEHcuyCNGAtzrY6',
  phoneDisplay: '0312-4669822',
  phoneRaw: '+923124669822',
  phoneLandline: '',
  phoneLandlineRaw: '',
  emailPrimary: 'saiidzia.co@gmail.com',
  emailSecondary: '',
  whatsappDisplay: '0312-4669822',
  whatsappUrl: 'https://wa.me/923124669822?text=Hello%20Sajid%20Zia%20%26%20Co.%20Chartered%20Accountants,%20I%20would%20like%20to%20inquire%20about%20your%20services.',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tab-home');
  const [inquiryForm, setInquiryForm] = useState(EMPTY_INQUIRY);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formError, setFormError] = useState('');

  // Sync with URL hash for clean SPA navigation on Vercel
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabType;
      if (['tab-home', 'tab-about-firm', 'tab-services', 'tab-about-us'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchTab = (tabId: TabType) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setFormError('');

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(FIRM_CONTACTS.emailPrimary)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: inquiryForm.name,
            email: inquiryForm.email,
            _replyto: inquiryForm.email,
            service: inquiryForm.service,
            message: inquiryForm.message,
            _subject: `Official Inquiry: ${inquiryForm.service} — Sajid Zia & Co.`,
            _template: 'table',
            _captcha: 'false',
          }),
        }
      );

      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean | string;
        message?: string;
      };
      const message = String(data.message || '');
      const awaitingInboxActivation = /activat/i.test(message);
      const delivered =
        data.success === true || data.success === 'true' || awaitingInboxActivation;

      if (!response.ok || !delivered) {
        throw new Error(message || 'Unable to send inquiry.');
      }

      setInquiryForm(EMPTY_INQUIRY);
      setFormStatus('sent');
    } catch {
      setFormStatus('error');
      setFormError(
        `The inquiry could not be delivered. Please email ${FIRM_CONTACTS.emailPrimary} directly or try again.`
      );
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col justify-between antialiased relative">
      {/* Top Regulatory & Contact Banner */}
      <header className="bg-navy-950 text-slate-200 border-b border-navy-800 text-xs sm:text-sm py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">
              Member Firm of <strong className="text-white font-semibold">The Institute of Chartered Accountants of Pakistan (ICAP)</strong>
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
            <a
              href={`mailto:${FIRM_CONTACTS.emailPrimary}`}
              className="hover:text-gold-500 text-slate-300 transition-colors flex items-center group"
              title="Click to send an email"
            >
              <i className="fa-solid fa-envelope text-gold-500 mr-1.5 group-hover:scale-110 transition-transform"></i>
              {FIRM_CONTACTS.emailPrimary}
            </a>
            <a
              href={`tel:${FIRM_CONTACTS.phoneRaw}`}
              className="hover:text-gold-500 text-slate-300 transition-colors flex items-center group font-medium"
              title="Click to place a call"
            >
              <i className="fa-solid fa-phone text-gold-500 mr-1.5 group-hover:scale-110 transition-transform"></i>
              {FIRM_CONTACTS.phoneDisplay}
            </a>
            <a
              href={FIRM_CONTACTS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center group"
              title="Chat directly on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-emerald-400 mr-1 text-sm group-hover:scale-110 transition-transform"></i>
              WhatsApp Chat
            </a>
          </div>
        </div>
      </header>

      {/* Main Navigation Header - Matched to Letterhead Branding */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-0 sm:h-20 gap-3 sm:gap-0">
            {/* Logo Brand: Letterhead Swoosh + Typography */}
            <div
              className="cursor-pointer select-none"
              onClick={() => switchTab('tab-home')}
            >
              <SzcLetterheadBrand />
            </div>

            {/* Top-Right: Official ICAP & CA Pakistan Logo from Letterhead */}
            <div className="hidden lg:flex items-center gap-3 border-l border-slate-200 pl-6 py-1">
              <IcapLetterheadLogo className="h-10" />
            </div>

            {/* 4 Main Navigation Tabs */}
            <div className="flex space-x-1 sm:space-x-6 border-b sm:border-0 border-slate-200 w-full sm:w-auto justify-center">
              <button
                onClick={() => switchTab('tab-home')}
                className={`py-3 sm:py-6 px-2 sm:px-3 text-xs sm:text-sm border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'tab-home'
                    ? 'border-gold-500 text-gold-500 font-bold'
                    : 'border-transparent text-slate-600 hover:text-navy-900'
                }`}
              >
                <i className="fa-solid fa-house mr-1 sm:mr-1.5"></i>
                Home
              </button>
              <button
                onClick={() => switchTab('tab-about-firm')}
                className={`py-3 sm:py-6 px-2 sm:px-3 text-xs sm:text-sm border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'tab-about-firm'
                    ? 'border-gold-500 text-gold-500 font-bold'
                    : 'border-transparent text-slate-600 hover:text-navy-900'
                }`}
              >
                <i className="fa-solid fa-building-columns mr-1 sm:mr-1.5"></i>
                About CA Firm
              </button>
              <button
                onClick={() => switchTab('tab-services')}
                className={`py-3 sm:py-6 px-2 sm:px-3 text-xs sm:text-sm border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'tab-services'
                    ? 'border-gold-500 text-gold-500 font-bold'
                    : 'border-transparent text-slate-600 hover:text-navy-900'
                }`}
              >
                <i className="fa-solid fa-briefcase mr-1 sm:mr-1.5"></i>
                Services
              </button>
              <button
                onClick={() => switchTab('tab-about-us')}
                className={`py-3 sm:py-6 px-2 sm:px-3 text-xs sm:text-sm border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'tab-about-us'
                    ? 'border-gold-500 text-gold-500 font-bold'
                    : 'border-transparent text-slate-600 hover:text-navy-900'
                }`}
              >
                <i className="fa-solid fa-address-card mr-1 sm:mr-1.5"></i>
                About Us
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-grow w-full">
        {/* TAB 1: HOME (Comprehensive Page Containing All Sections) */}
        {activeTab === 'tab-home' && (
          <section className="tab-content space-y-10">
            {/* Hero / Practice Overview with Royal Navy & Gold Accent */}
            <div className="bg-navy-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden border-b-4 border-gold-500 shadow-md">
              {/* Letterhead Geometric Diagonal Corner Accent */}
              <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none opacity-20 bg-[linear-gradient(135deg,transparent_60%,#c68b2c_60%,#c68b2c_75%,#1e2b58_75%)]"></div>

              <div className="max-w-3xl relative z-10 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block bg-navy-800 text-gold-500 border border-gold-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    ICAP Registered Firm
                  </span>
                  <span className="inline-block bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                    CA Pakistan
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                  <span className="text-gold-500">Sajid Zia & Co.</span>
                </h2>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  A public accountancy practice offering independent audit, tax advisory, accounting, and regulatory compliance services under the guidelines of the Institute of Chartered Accountants of Pakistan (ICAP).
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => switchTab('tab-services')}
                    className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    Explore Services <i className="fa-solid fa-arrow-right"></i>
                  </button>
                  <button
                    onClick={() => switchTab('tab-about-us')}
                    className="bg-navy-800 hover:bg-navy-800/80 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Contact Information
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 1 ON HOME: About CA Firm Overview */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg sm:text-xl font-bold text-navy-900">
                  1. About the CA Firm
                </h3>
                <button
                  onClick={() => switchTab('tab-about-firm')}
                  className="text-xs text-gold-600 font-bold hover:underline cursor-pointer"
                >
                  View Dedicated Tab &rarr;
                </button>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Chartered Accountancy firms in Pakistan are governed by the Chartered Accountants Ordinance, 1961 and regulated by <strong>The Institute of Chartered Accountants of Pakistan (ICAP)</strong>. Independent audits conducted by Chartered Accountants serve as a vital mechanism to ensure statutory compliance, financial integrity, and objective reporting for businesses, institutions, and regulatory authorities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong className="block text-navy-900 text-sm mb-1">
                    <i className="fa-solid fa-scale-balanced text-gold-500 mr-1.5"></i>
                    Regulatory Oversight
                  </strong>
                  Operating within established legal and professional standards enforced by ICAP, SECP, and FBR.
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong className="block text-navy-900 text-sm mb-1">
                    <i className="fa-solid fa-shield-halved text-gold-500 mr-1.5"></i>
                    Independence & Ethics
                  </strong>
                  Maintaining strict adherence to the International Code of Ethics for Professional Accountants.
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong className="block text-navy-900 text-sm mb-1">
                    <i className="fa-solid fa-file-check text-gold-500 mr-1.5"></i>
                    Statutory Reporting
                  </strong>
                  Providing formal, objective evaluation of financial records in compliance with applicable IFRS framework.
                </div>
              </div>
            </div>

            {/* SECTION 2 ON HOME: Services Overview */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg sm:text-xl font-bold text-navy-900">
                  2. Services Provided
                </h3>
                <button
                  onClick={() => switchTab('tab-services')}
                  className="text-xs text-gold-600 font-bold hover:underline cursor-pointer"
                >
                  View Dedicated Tab &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded bg-navy-900 text-gold-500 font-bold text-xs flex items-center justify-center">
                    01
                  </div>
                  <h4 className="font-bold text-navy-900 text-sm">Audit & Assurance</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Statutory audits, internal audit evaluations, special reviews, and statutory compliance checks.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded bg-gold-50 text-gold-600 border border-gold-200 font-bold text-xs flex items-center justify-center">
                    02
                  </div>
                  <h4 className="font-bold text-navy-900 text-sm">Taxation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Income tax filing, sales tax compliance (FBR / Provincial Revenue Authorities), and tax advisory.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center">
                    03
                  </div>
                  <h4 className="font-bold text-navy-900 text-sm">Bookkeeping</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    General ledger maintenance, preparation of financial statements under IFRS, and payroll records.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded bg-navy-800 text-slate-100 font-bold text-xs flex items-center justify-center">
                    04
                  </div>
                  <h4 className="font-bold text-navy-900 text-sm">SECP Compliances</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Company incorporation, secretarial filings, statutory returns, and corporate record maintenance.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3 ON HOME: About Us Overview & Letterhead-Synced Contact Particulars */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg sm:text-xl font-bold text-navy-900">
                  3. About Us & Practice Details
                </h3>
                <button
                  onClick={() => switchTab('tab-about-us')}
                  className="text-xs text-gold-600 font-bold hover:underline cursor-pointer"
                >
                  View Dedicated Tab &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                  <p>
                    <strong className="text-navy-900">Sajid Zia & Co.</strong> provides professional accounting, auditing, taxation, and secretarial services to corporations, partnerships, and private enterprises across Pakistan.
                  </p>
                  <p>
                    Our practice is committed to objective financial evaluation, statutory accuracy, and compliance with the regulatory requirements set forth by local revenue authorities and statutory commissions.
                  </p>
                </div>

                {/* Letterhead Styled Contact Particulars */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3 text-xs sm:text-sm">
                  <div className="font-bold text-navy-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span>Firm Contact Particulars</span>
                    <span className="text-[10px] text-gold-600 font-semibold uppercase">Official Head Office</span>
                  </div>

                  {/* Registered Address: Johar Town from Letterhead */}
                  <a
                    href={FIRM_CONTACTS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-slate-700 hover:text-gold-600 transition-colors group cursor-pointer"
                    title="Click to open location in Google Maps"
                  >
                    <div className="w-7 h-7 rounded bg-gold-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:bg-gold-600 transition-colors">
                      <i className="fa-solid fa-location-dot text-xs"></i>
                    </div>
                    <div>
                      <strong className="text-navy-900 group-hover:underline block">Registered Address:</strong>
                      <span>{FIRM_CONTACTS.address}</span>
                      <span className="block text-[11px] text-gold-600 font-semibold mt-0.5">
                        <i className="fa-solid fa-arrow-up-right-from-square mr-1 text-[10px]"></i>Open Pin in Google Maps
                      </span>
                    </div>
                  </a>

                  {/* Phone: Direct 0312-4669822 from Letterhead */}
                  <div className="flex items-start gap-3 text-slate-700">
                    <div className="w-7 h-7 rounded bg-gold-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <i className="fa-solid fa-phone text-xs"></i>
                    </div>
                    <div>
                      <strong className="text-navy-900 block">Phone / Mobile:</strong>
                      <div className="flex flex-wrap gap-2 mt-0.5">
                        <a
                          href={`tel:${FIRM_CONTACTS.phoneRaw}`}
                          className="text-navy-900 hover:text-gold-600 font-bold hover:underline inline-flex items-center gap-1"
                          title="Click to call primary line from letterhead"
                        >
                          {FIRM_CONTACTS.phoneDisplay}
                        </a>
                        {/*<span className="text-slate-400">/</span>*/}
                        <a
                          href={`tel:${FIRM_CONTACTS.phoneLandlineRaw}`}
                          className="text-slate-600 hover:text-gold-600 hover:underline"
                          title="Click to call landline"
                        >
                          {FIRM_CONTACTS.phoneLandline}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email: sajidzia.co@gmail.com from Letterhead */}
                  <div className="flex items-start gap-3 text-slate-700">
                    <div className="w-7 h-7 rounded bg-gold-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <i className="fa-solid fa-envelope text-xs"></i>
                    </div>
                    <div>
                      <strong className="text-navy-900 block">Email:</strong>
                      <div className="flex flex-wrap gap-2 mt-0.5">
                        <a
                          href={`mailto:${FIRM_CONTACTS.emailPrimary}`}
                          className="text-navy-900 hover:text-gold-600 font-bold hover:underline"
                          title="Click to send email to sajidzia.co@gmail.com"
                        >
                          {FIRM_CONTACTS.emailPrimary}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Direct Chat */}
                  <div className="flex items-center gap-3 text-slate-700 pt-2 border-t border-slate-200">
                    <div className="w-7 h-7 rounded bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <i className="fa-brands fa-whatsapp text-sm"></i>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-navy-900">WhatsApp:</strong>
                      <a
                        href={FIRM_CONTACTS.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline inline-flex items-center gap-1.5"
                        title="Click to chat directly on WhatsApp"
                      >
                        <span>{FIRM_CONTACTS.whatsappDisplay}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                          Chat Now &rarr;
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: ABOUT CA FIRM */}
        {activeTab === 'tab-about-firm' && (
          <section className="tab-content space-y-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                Regulatory Framework
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-4 mb-4">
                Chartered Accountancy in Pakistan
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                Chartered Accountancy firms operate under statutory authority to maintain the integrity of financial reporting, assurance, and public accountability. In Pakistan, the practice of public accountancy is governed by <strong>The Institute of Chartered Accountants of Pakistan (ICAP)</strong>, established under the Chartered Accountants Ordinance, 1961.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Independent audits performed by Chartered Accountants provide statutory assurance to shareholders, tax authorities, banking institutions, and statutory regulators regarding the fair presentation of financial statements in compliance with International Financial Reporting Standards (IFRS) and local regulatory frameworks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-navy-900 text-gold-500 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  <i className="fa-solid fa-scale-balanced"></i>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  Statutory Governance
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Enforcing corporate governance standards and regulatory compliance as mandated by SECP, FBR, and ICAP guidelines.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-gold-50 text-gold-600 border border-gold-200 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  <i className="fa-solid fa-file-signature"></i>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  Financial Transparency
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Evaluating internal controls and financial records to present objective, accurate financial reports to stakeholders.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  Professional Standards
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Adhering strictly to International Standards on Auditing (ISA) and the IFAC Ethics Code to maintain complete independence.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: SERVICES PROVIDED */}
        {activeTab === 'tab-services' && (
          <section className="tab-content space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">
                Professional Practice Areas
              </h2>
              <p className="text-slate-600 text-sm">
                Comprehensive accountancy, statutory audit, taxation, and corporate compliance services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audit & Assurance */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-gold-500 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-navy-900 text-gold-500 rounded-lg">
                    <i className="fa-solid fa-magnifying-glass-chart text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">Audit & Assurance</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                  <li>Statutory Financial Statement Audits</li>
                  <li>Internal Audit & Internal Control Evaluation</li>
                  <li>Special Purpose Audits & Due Diligence Reviews</li>
                  <li>Compliance Reviews for Regulatory Submissions</li>
                </ul>
              </div>

              {/* Taxation Services */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-gold-500 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gold-50 text-gold-600 border border-gold-200 rounded-lg">
                    <i className="fa-solid fa-calculator text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">Taxation Services</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                  <li>Direct Income Tax Return Preparation & Filing (FBR)</li>
                  <li>Indirect Tax Compliance (Sales Tax / PRA / SRB)</li>
                  <li>Withholding Tax Computations & Quarterly Statements</li>
                  <li>Tax Advisory & Assessment Proceeding Representation</li>
                </ul>
              </div>

              {/* Bookkeeping & Accounting */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-gold-500 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                    <i className="fa-solid fa-book-bookmark text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">
                    Bookkeeping & Financial Accounting
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                  <li>Preparation of General Ledger & Maintenance of Accounts</li>
                  <li>Financial Statement Preparation under IFRS/SME Standards</li>
                  <li>Payroll Management & Reconciliation Services</li>
                  <li>Management Reporting & Financial Analysis</li>
                </ul>
              </div>

              {/* SECP Compliances */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-gold-500 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-navy-800 text-slate-100 rounded-lg">
                    <i className="fa-solid fa-building-user text-xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">
                    SECP Compliances & Secretarial
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                  <li>Company Incorporation & Secretarial Services</li>
                  <li>Annual & Periodical Statutory Filings with SECP</li>
                  <li>Maintenance of Statutory Registers & Share Records</li>
                  <li>Corporate Restructuring & Statutory Filings Advice</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: ABOUT US */}
        {activeTab === 'tab-about-us' && (
          <section className="tab-content space-y-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-navy-900 mb-4">
                About <span className="text-gold-500">Sajid Zia & Co.</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                Sajid Zia & Co. is a practicing firm of Chartered Accountants operating in Pakistan. The firm provides statutory auditing, financial consulting, tax advisory, and corporate compliance services in strict accordance with professional standards established by the Institute of Chartered Accountants of Pakistan (ICAP).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Practice Office Details - Styled to Match Letterhead */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-navy-900">
                    Office Contact Particulars
                  </h3>
                  <span className="text-xs text-gold-600 font-bold">Official Registered Head Office</span>
                </div>

                {/* Interactive Address: Johar Town from Letterhead */}
                <a
                  href={FIRM_CONTACTS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gold-50/50 transition-colors group cursor-pointer border border-transparent hover:border-gold-200"
                  title="Click to open location in Google Maps"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs group-hover:scale-105 transition-transform">
                    <i className="fa-solid fa-location-dot text-base"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900 group-hover:text-gold-600 flex items-center gap-1.5">
                      <span>Physical Address (Johar Town)</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs text-gold-500"></i>
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed mt-1 font-medium">
                      {FIRM_CONTACTS.address}
                    </p>
                    <span className="inline-block mt-1 text-xs text-gold-600 font-bold underline decoration-dotted">
                      Open pin location in Google Maps &rarr;
                    </span>
                  </div>
                </a>

                {/* Interactive Telephone Lines: 0312-4669822 from Letterhead */}
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-gold-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <i className="fa-solid fa-phone text-base"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">Telephone Lines</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Click number to launch phone calling app:</p>
                    <div className="mt-1 space-y-1">
                      <div>
                        <a
                          href={`tel:${FIRM_CONTACTS.phoneRaw}`}
                          className="text-navy-900 hover:text-gold-600 font-extrabold text-sm hover:underline inline-flex items-center gap-1.5"
                          title="Click to dial 0312-4669822"
                         >
                          <i className="fa-solid fa-phone-volume text-xs text-gold-500"></i>
                          <span>{FIRM_CONTACTS.phoneDisplay}</span>
                        </a>
                      </div>
                      
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp from Letterhead Number */}
                <a
                  href={FIRM_CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors group cursor-pointer border border-emerald-200 bg-emerald-50/40"
                  title="Click to chat directly on WhatsApp"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs group-hover:scale-110 transition-transform">
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>Official WhatsApp Chat</span>
                      <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                        Online
                      </span>
                    </h4>
                    <p className="text-slate-800 text-sm font-extrabold mt-1">
                      {FIRM_CONTACTS.whatsappDisplay}
                    </p>
                    <span className="inline-block mt-1 text-xs text-emerald-700 font-bold underline decoration-dotted">
                      Click to start direct WhatsApp chat &rarr;
                    </span>
                  </div>
                </a>

                {/* Interactive Electronic Mail: sajidzia.co@gmail.com from Letterhead */}
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-gold-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <i className="fa-solid fa-envelope text-base"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">Electronic Mail</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Click address to open email composer:</p>
                    <div className="mt-1 space-y-1">
                      <div>
                        <a
                          href={`mailto:${FIRM_CONTACTS.emailPrimary}`}
                          className="text-navy-900 hover:text-gold-600 font-extrabold text-sm hover:underline inline-flex items-center gap-1.5"
                          title={`Click to compose email to ${FIRM_CONTACTS.emailPrimary}`}
                        >
                          <i className="fa-regular fa-paper-plane text-xs text-gold-500"></i>
                          <span>{FIRM_CONTACTS.emailPrimary}</span>
                          <span className="text-[10px] text-gold-700 font-normal bg-gold-50 border border-gold-200 px-1.5 py-0.2 rounded">
                            Official Email
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Regulatory Status */}
                <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-navy-900 text-gold-500 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <i className="fa-solid fa-certificate text-base"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">
                      Professional Regulatory Status
                    </h4>
                    <p className="text-slate-700 text-sm mt-0.5 font-medium">
                      ICAP Registered CA Firm Practice
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chartered Accountants Ordinance, 1961
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Inquiry Form */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-navy-900 border-b border-slate-100 pb-3 mb-4">
                  Official Inquiry Form
                </h3>

                <form onSubmit={handleInquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Full Name / Corporate Entity Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={formStatus === 'sending'}
                      value={inquiryForm.name}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={formStatus === 'sending'}
                      value={inquiryForm.email}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Service Area Required
                    </label>
                    <select
                      name="service"
                      disabled={formStatus === 'sending'}
                      value={inquiryForm.service}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, service: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none bg-white disabled:bg-slate-50"
                    >
                      <option>Audit & Assurance</option>
                      <option>Taxation Services</option>
                      <option>Bookkeeping & Financial Accounting</option>
                      <option>SECP Compliance & Secretarial</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Message / Detail
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      required
                      disabled={formStatus === 'sending'}
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, message: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none disabled:bg-slate-50"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full bg-navy-900 hover:bg-navy-800 disabled:bg-navy-800 disabled:cursor-wait text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-xs cursor-pointer border-b-2 border-gold-500"
                  >
                    {formStatus === 'sending' ? 'Sending Inquiry…' : 'Submit Inquiry'}
                  </button>
                </form>

                {formStatus === 'sent' && (
                  <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs border border-emerald-200">
                    Thank you. Your inquiry has been sent to team for review.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="mt-3 p-3 bg-rose-50 text-rose-800 rounded-lg text-xs border border-rose-200">
                    {formError}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating WhatsApp Action Button with letterhead direct number */}
      <a
        href={FIRM_CONTACTS.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-4 py-3 shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-xs font-bold group cursor-pointer border-2 border-white"
        title="Chat with Sajid Zia & Co. on WhatsApp (0312-4669822)"
      >
        <i className="fa-brands fa-whatsapp text-xl text-white group-hover:scale-110 transition-transform"></i>
        <span className="hidden sm:inline">WhatsApp: {FIRM_CONTACTS.whatsappDisplay}</span>
      </a>

      {/* Footer - Styled with Royal Navy, Letterhead Brand, and ICAP CA Pakistan Logo */}
      <footer className="bg-navy-950 text-slate-300 py-8 border-t-4 border-gold-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-6 border-b border-navy-800">
            <div className="flex items-center gap-2">
              {/* Left: Brand Identity from Letterhead */}
              <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex items-center">
                <SajidZiaLogo className="h-10" />
              </div>

              {/* ICAP Regulatory Insignia from Letterhead */}
              <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex items-center justify-center">
                <IcapPakistanLogo className="h-10" />
              </div>
            </div>

            {/* Right: Contact Particulars */}
            <div className="text-center sm:text-right text-slate-300 space-y-1.5">
              <div>
                <a
                  href={FIRM_CONTACTS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-500 transition-colors inline-flex items-center gap-1 group"
                  title="Open Johar Town office in Google Maps"
                >
                  <i className="fa-solid fa-location-dot text-gold-500 mr-1 group-hover:scale-110 transition-transform"></i>
                  <span>{FIRM_CONTACTS.addressShort}</span>
                </a>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3">
                <a
                  href={`tel:${FIRM_CONTACTS.phoneRaw}`}
                  className="hover:text-gold-500 transition-colors inline-flex items-center gap-1 font-semibold"
                  title="Call mobile line"
                >
                  <i className="fa-solid fa-phone text-gold-500 mr-1"></i>
                  <span>{FIRM_CONTACTS.phoneDisplay}</span>
                </a>
                <span>&nbsp;|&nbsp;</span>
                <a
                  href={`mailto:${FIRM_CONTACTS.emailPrimary}`}
                  className="hover:text-gold-500 transition-colors inline-flex items-center gap-1 font-medium"
                  title="Send email"
                >
                  <i className="fa-solid fa-envelope text-gold-500 mr-1"></i>
                  <span>{FIRM_CONTACTS.emailPrimary}</span>
                </a>
                <span>&nbsp;|&nbsp;</span>
                <a
                  href={FIRM_CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 text-emerald-400 font-bold transition-colors inline-flex items-center gap-1"
                  title="Chat on WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp mr-1"></i>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-400 text-center sm:text-left text-[11px]">
            <p>&copy; 2026 Sajid Zia & Co. Chartered Accountants. All Rights Reserved.</p>
            <p>
              Member practice regulated by The Institute of Chartered Accountants of Pakistan (ICAP).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
