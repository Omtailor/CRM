import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/client';
import { ArrowLeft, AlertCircle } from '../components/icons';

/* ── Reusable form field components ─────────────────────────────── */
function FieldLabel({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}
      {required && (
        <span className="text-red-500 ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1" role="alert">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

function inputClass(hasError) {
  return `w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
    hasError
      ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
      : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
  }`;
}

/* ── Loading spinner ─────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
function CreateTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_name.trim())
      newErrors.customer_name = 'Customer name is required';
    if (!formData.customer_email.trim())
      newErrors.customer_email = 'Email address is required';
    else if (!validateEmail(formData.customer_email))
      newErrors.customer_email = 'Please enter a valid email address';
    if (!formData.subject.trim())
      newErrors.subject = 'Subject is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await createTicket(formData);
      navigate(`/tickets/${response.ticket_id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        aria-label="Back to tickets list"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tickets
      </button>

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Ticket</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Fill in the details below to open a new support ticket.
        </p>
      </div>

      {/* Submit error alert */}
      {submitError && (
        <div
          className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Unable to create ticket</p>
            <p className="text-sm text-red-600 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Form card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5">
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel htmlFor="customer_name" required>
                  Customer Name
                </FieldLabel>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Smith"
                  autoComplete="name"
                  aria-required="true"
                  aria-describedby={errors.customer_name ? 'err-name' : undefined}
                  className={inputClass(!!errors.customer_name)}
                  disabled={isSubmitting}
                />
                <FieldError message={errors.customer_name} />
              </div>

              <div>
                <FieldLabel htmlFor="customer_email" required>
                  Customer Email
                </FieldLabel>
                <input
                  type="email"
                  id="customer_email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="e.g. jane@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={errors.customer_email ? 'err-email' : undefined}
                  className={inputClass(!!errors.customer_email)}
                  disabled={isSubmitting}
                />
                <FieldError message={errors.customer_email} />
              </div>
            </div>

            {/* Subject */}
            <div>
              <FieldLabel htmlFor="subject" required>
                Subject
              </FieldLabel>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief summary of the issue"
                aria-required="true"
                className={inputClass(!!errors.subject)}
                disabled={isSubmitting}
              />
              <FieldError message={errors.subject} />
            </div>

            {/* Description */}
            <div>
              <FieldLabel htmlFor="description" required>
                Description
              </FieldLabel>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the issue in detail..."
                aria-required="true"
                className={`${inputClass(!!errors.description)} resize-none`}
                disabled={isSubmitting}
              />
              <FieldError message={errors.description} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-7 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;
