import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/client';
import { ArrowLeft, AlertCircle } from '../components/icons';
import TicketForm from '../components/tickets/TicketForm';

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
      <TicketForm
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}

export default CreateTicket;
