import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Trash2, Plus } from 'lucide-react';
import { useCreateBulkClassesMutation } from '@/services/leApi/classApi';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
import LeInput from '@/components/ui/LeInput/LeInput';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import LeFormError from '@/components/ui/LeFormError/LeFormError';
import { CATEGORY_OPTIONS } from '@/services/leApi/classApi';
import type { Category } from '@/services/leApi/classApi';
import './AddClassForm.css';

interface AddClassFormProps {
  onSuccess?: (values: { name: string; category: Category }[]) => void;
  onCancel?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

const ClassSchema = Yup.object().shape({
  classes: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Class name is required').min(2, 'Class name is too short'),
        category: Yup.string().required('Category is required'),
      })
    )
    .min(1, 'At least one class is required'),
});

const AddClassForm: React.FC<AddClassFormProps> = ({ onSuccess, onCancel, onLoadingChange }) => {
  const school = useFindMySchoolQuery();
  const schoolData = school?.currentData;
  const [createBulkClasses, { isLoading }] = useCreateBulkClassesMutation();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleAddClass = async (values: { classes: { name: string; category: Category }[] }) => {
    if (!schoolData?.id) {
      console.error('No school ID found');
      return;
    }

    try {
      await createBulkClasses({
        classes: values.classes,
        schoolId: schoolData.id,
      }).unwrap();

      onSuccess?.(values.classes);
    } catch (err: any) {
      console.error('Failed to create classes:', err);
      const msg = err?.data?.message || err?.message || 'An unexpected error occurred.';
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const formik = useFormik({
    initialValues: {
      classes: [{ name: '', category: '' as Category }],
    },
    validationSchema: ClassSchema,
    onSubmit: handleAddClass,
  });

  React.useEffect(() => {
    if (errorMessage) setErrorMessage(null);
  }, [formik.values]);

  const handleAddRow = () => {
    formik.setFieldValue('classes', [...formik.values.classes, { name: '', category: '' as Category }]);
  };

  const handleRemoveRow = (index: number) => {
    const newClasses = [...formik.values.classes];
    newClasses.splice(index, 1);
    formik.setFieldValue('classes', newClasses);
  };

  return (
    <div className="add-class-form-container">
      <div className="form-header">
        <h2 className="form-title">Create New Classes</h2>
        <p className="form-subtitle">Add multiple new classes to your school's academic structure at once.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-class-form">
        <div className="classes-list">
          {formik.values.classes.map((_class, index) => {
            const nameError =
              formik.errors.classes?.[index] && typeof formik.errors.classes[index] === 'object'
                ? (formik.errors.classes[index] as any).name
                : undefined;
            const categoryError =
              formik.errors.classes?.[index] && typeof formik.errors.classes[index] === 'object'
                ? (formik.errors.classes[index] as any).category
                : undefined;
            const nameTouched = formik.touched.classes?.[index]?.name;
            const categoryTouched = formik.touched.classes?.[index]?.category;

            return (
              <div key={index} className="class-row">
                <LeInput
                  id={`classes.${index}.name`}
                  name={`classes.${index}.name`}
                  label={
                    <div className="class-name-label">
                      <span>Class Name {index + 1}</span>
                      <button
                        type="button"
                        className="remove-row-btn-inline"
                        onClick={() => handleRemoveRow(index)}
                        disabled={formik.values.classes.length <= 1}
                        aria-label="Remove class"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  }
                  value={formik.values.classes[index].name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={nameTouched && nameError ? nameError : undefined}
                  touched={!!nameTouched}
                  placeholder="e.g. Primary 1, JSS 2"
                  autoFocus={index === 0}
                />

                <LeDropdown
                  id={`classes.${index}.category`}
                  name={`classes.${index}.category`}
                  label={`Academic Category ${index + 1}`}
                  value={formik.values.classes[index].category}
                  onChange={formik.handleChange}
                  onBlur={() => formik.setFieldTouched(`classes.${index}.category`, true)}
                  error={categoryTouched && categoryError ? categoryError : undefined}
                  touched={!!categoryTouched}
                  options={CATEGORY_OPTIONS}
                />
              </div>
            );
          })}
        </div>

        <hr className="form-divider" />

        <button type="button" className="add-row-btn" onClick={handleAddRow}>
          <Plus size={20} />
          Add Another Class
        </button>

        <div className="form-actions">
          <button
            type="button"
            className="le-button le-button-outline cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="le-button le-button-primary submit-btn"
            disabled={!formik.isValid || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Classes'}
          </button>
        </div>
        <LeFormError message={errorMessage || ''} onClose={() => setErrorMessage(null)} />
      </form>
    </div>
  );
};

export default AddClassForm;
