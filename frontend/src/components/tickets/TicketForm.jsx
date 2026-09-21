import { FieldLabel, FieldError } from './FormField';
import Spinner from '../common/Spinner';

function inputClass(hasError) {
  return `w-full px-3.5 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
    hasError
      ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
      : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
  }`;
}

function TicketForm({
  formData,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <form onSubmit={onSubmit} noValidate>
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
                onChange={onChange}
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
                onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
            onClick={onCancel}
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
  );
}

export default TicketForm;
