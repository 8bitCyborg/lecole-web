import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Save } from 'lucide-react';
import { useCreateGradingModuleMutation, useUpdateGradingModuleMutation } from '@/services/leApi/gradingApi';
import type { GradingModule } from '@/services/leApi/gradingApi';
import LeInput from '@/components/ui/LeInput/LeInput';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import './styles.css';

interface GradeModuleFormProps {
  module?: GradingModule;
  currentTotalPercentage: number;
  onSuccess: () => void;
  onCancel: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'CA', label: 'Continuous Assessment (CA)' },
  { value: 'PRACTICAL', label: 'Practical / Project' },
  { value: 'EXAM', label: 'Examination' },
  { value: 'OTHER', label: 'Other / Misc' },
];

const GradeModuleForm: React.FC<GradeModuleFormProps> = ({
  module,
  currentTotalPercentage,
  onSuccess,
  onCancel,
  onLoadingChange
}) => {
  const isEditMode = !!module;
  const basePercentage = isEditMode ? (currentTotalPercentage - (module?.percentage || 0)) : currentTotalPercentage;
  const maxAllowed = Math.max(0, 100 - basePercentage);

  const ModuleSchema = Yup.object().shape({
    name: Yup.string().required('Module name is required').min(3, 'Name is too short'),
    percentage: Yup.number()
      .required('Percentage is required')
      .min(0, 'Cannot be less than 0%')
      .max(maxAllowed, `Remaining allocation is ${maxAllowed}%. Contribution cannot exceed this.`),
    category: Yup.string().oneOf(['CA', 'EXAM', 'PRACTICAL', 'OTHER'], 'Invalid category').required('Category is required'),
    sequence: Yup.number().min(0, 'Sequence cannot be negative'),
  });

  const [createModule, { isLoading: isCreating }] = useCreateGradingModuleMutation();
  const [updateModule, { isLoading: isUpdating }] = useUpdateGradingModuleMutation();
  const isLoading = isCreating || isUpdating;

  React.useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const formik = useFormik({
    initialValues: {
      name: module?.name || '',
      percentage: module?.percentage || '',
      category: module?.category || '',
      sequence: module?.sequence || 0,
    },
    validationSchema: ModuleSchema,
    onSubmit: async (values) => {
      console.log('values', values);
      try {
        if (isEditMode) {
          await updateModule({
            id: module!.id,
            name: values.name,
            percentage: Number(values.percentage),
            category: values.category as any,
            sequence: values.sequence,
          }).unwrap();
        } else {
          await createModule({
            name: values.name,
            percentage: Number(values.percentage),
            category: values.category as any,
            sequence: values.sequence,
          }).unwrap();
        }
        onSuccess();
      } catch (err) {
        console.error('Failed to save grading module:', err);
      }
    },
    enableReinitialize: true,
  });

  return (
    <div className="grading-form-container">
      <div className="grading-form-header">
        <h2 className="grading-form-title">
          {isEditMode ? 'Modify Configuration' : 'Create Grade Module'}
        </h2>
        <p className="grading-form-subtitle">
          {isEditMode
            ? `Updating performance metric for "${module!.name}".`
            : 'Establish a new grading metric and define its contribution to overall academic success.'}
        </p>
        {!module?.isLocked && (
          <div className="form-allocation-notice">
            Available Allocation: <strong>{maxAllowed}%</strong>
          </div>
        )}
      </div>

      <form onSubmit={formik.handleSubmit} className="grading-form-content">
        <LeInput
          id="name"
          label="Name"
          {...formik.getFieldProps('name')}
          error={formik.errors.name as string}
          touched={formik.touched.name}
          placeholder="e.g. First Test"
        // disabled={module?.isLocked}
        />

        <div className="grading-input-row">
          <LeInput
            id="percentage"
            label="Percentage (%)"
            type="number"
            {...formik.getFieldProps('percentage')}
            error={formik.errors.percentage as string}
            touched={formik.touched.percentage}
            placeholder={`Max ${maxAllowed}`}
            min="0"
            max={100}
          // disabled={module?.isLocked}
          />

          <LeDropdown
            id="category"
            label="Category"
            options={CATEGORY_OPTIONS}
            {...formik.getFieldProps('category')}
            error={formik.errors.category as string}
            touched={formik.touched.category}
          // disabled={module?.isLocked}
          />
        </div>

        <LeInput
          id="sequence"
          label="Display Order"
          type="number"
          {...formik.getFieldProps('sequence')}
          error={formik.errors.sequence as string}
          touched={formik.touched.sequence}
          placeholder="1"
        // disabled={module?.isLocked}
        />

        <div className="grading-form-actions">
          <button
            type="button"
            className="grading-btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Discard
          </button>
          <button
            type="submit"
            className="grading-btn-submit"
            disabled={!formik.isValid || formik.isSubmitting || isLoading}
          >
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                <Save size={18} />
                {isEditMode ? 'Authorize Changes' : 'Confirm & Create'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GradeModuleForm;