import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'AI Symptom Checker',
    desc: 'Describe your symptoms and get instant AI-powered analysis with severity assessment and specialist recommendations.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Find Specialists',
    desc: 'Browse verified doctors across all specializations. Filter by availability, location, and consultation fee.',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Easy Booking',
    desc: 'Book in-person, video, or phone consultations in seconds. Manage and track all your appointments in one place.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Health Records',
    desc: 'Keep all your symptom history, diagnoses, and health data securely stored and accessible anytime.',
    color: 'from-orange-500 to-orange-600'
  }
];

const STATS = [
  { value: '50,000+', label: 'Patients Served' },
  { value: '500+', label: 'Verified Doctors' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Support Available' }
];

const TESTIMONIALS = [
  {
    name: 'Maria Johnson',
    role: 'Patient',
    text: 'HealthHub helped me identify my symptoms quickly and connect with the right specialist. The booking process was seamless!',
    avatar: 'MJ'
  },
  {
    name: 'David Park',
    role: 'Patient',
    text: 'I love how easy it is to manage all my health records in one place. The symptom checker is surprisingly accurate.',
    avatar: 'DP'
  },
  {
    name: 'Aisha Okonkwo',
    role: 'Patient',
    text: 'Found an excellent cardiologist through HealthHub within minutes. The doctor profiles are very detailed and helpful.',
    avatar: 'AO'
  }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Trusted by 50,000+ patients
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Your Health,<br />
                <span className="text-teal-300">Our Priority</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                AI-powered symptom checking, verified specialist doctors, and seamless appointment booking — all in one platform.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/dashboard" className="btn bg-white text-primary-700 hover:bg-blue-50 font-semibold px-8 py-3 text-base shadow-lg">
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="btn bg-white text-primary-700 hover:bg-blue-50 font-semibold px-8 py-3 text-base shadow-lg">
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn border-2 border-white/60 text-white hover:bg-white/10 font-semibold px-8 py-3 text-base">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/20 rounded-xl p-3">
                      <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Symptom Analyzed</p>
                        <p className="text-xs text-blue-200">Headache — Low severity</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/20 rounded-xl p-3">
                      <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Dr. Sarah Mitchell</p>
                        <p className="text-xs text-blue-200">Cardiologist — Available</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/20 rounded-xl p-3">
                      <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Appointment Booked</p>
                        <p className="text-xs text-blue-200">Tomorrow, 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From symptom analysis to specialist booking, HealthHub covers your entire healthcare journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Get the care you need in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Describe Symptoms', desc: 'Enter your symptoms in plain language. Our AI analyzes them and provides an instant assessment with severity level.' },
              { step: '02', title: 'Find Your Doctor', desc: 'Browse our network of verified specialists. Filter by specialization, availability, and location to find the perfect match.' },
              { step: '03', title: 'Book & Consult', desc: 'Book an in-person, video, or phone consultation in seconds. Receive reminders and manage everything from your dashboard.' }
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">What Patients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-primary-600 to-teal-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
            <p className="text-xl text-blue-100 mb-8">Join thousands of patients who trust HealthHub for their healthcare needs.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="btn bg-white text-primary-700 hover:bg-blue-50 font-semibold px-10 py-3 text-base shadow-lg">
                Create Free Account
              </Link>
              <Link to="/login" className="btn border-2 border-white/60 text-white hover:bg-white/10 font-semibold px-10 py-3 text-base">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
