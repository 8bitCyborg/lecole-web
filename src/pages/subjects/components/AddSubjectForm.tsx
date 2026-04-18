import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Trash2, Plus } from 'lucide-react';
import { useCreateBulkSubjectsMutation } from '../../../services/leApi/subjectApi';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
import LeInput from '../../../components/ui/LeInput/LeInput';
import LeFormError from '../../../components/ui/LeFormError/LeFormError';
import './AddSubjectForm.css';

interface AddSubjectFormProps {
  onSuccess?: (values: { name: string; code?: string }[]) => void;
  onCancel?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

const SubjectSchema = Yup.object().shape({
  subjects: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Subject name is required').min(2, 'Subject name is too short'),
        code: Yup.string().optional(),
      })
    )
    .min(1, 'At least one subject is required'),
});

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({ onSuccess, onCancel, onLoadingChange }) => {
  const school = useFindMySchoolQuery();
  const schoolData = school?.currentData;
  const [createBulkSubjects, { isLoading }] = useCreateBulkSubjectsMutation();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleAddSubject = async (values: { subjects: { name: string; code?: string }[] }) => {
    if (!schoolData?.id) {
      console.error('No school ID found');
      return;
    }

    try {
      await createBulkSubjects({
        subjects: values.subjects,
        schoolId: schoolData.id,
      }).unwrap();

      onSuccess?.(values.subjects);
    } catch (err: any) {
      console.error('Failed to create subjects:', err);
      const msg = err?.data?.message || err?.message || 'An unexpected error occurred.';
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const formik = useFormik({
    initialValues: {
      subjects: [{ name: '', code: '' }],
    },
    validationSchema: SubjectSchema,
    onSubmit: handleAddSubject,
  });

  React.useEffect(() => {
    if (errorMessage) setErrorMessage(null);
  }, [formik.values]);

  const handleAddRow = () => {
    formik.setFieldValue('subjects', [...formik.values.subjects, { name: '', code: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    const newSubjects = [...formik.values.subjects];
    newSubjects.splice(index, 1);
    formik.setFieldValue('subjects', newSubjects);
  };

  return (
    <div className="add-subject-form-container">
      <div className="form-header">
        <h2 className="form-title">Create New Subjects</h2>
        <p className="form-subtitle">Add multiple new subjects to your school's curriculum at once.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-subject-form">
        <div className="subjects-list">
          {formik.values.subjects.map((_subject, index) => {
            const nameError =
              formik.errors.subjects?.[index] && typeof formik.errors.subjects[index] === 'object'
                ? (formik.errors.subjects[index] as any).name
                : undefined;
            const codeError =
              formik.errors.subjects?.[index] && typeof formik.errors.subjects[index] === 'object'
                ? (formik.errors.subjects[index] as any).code
                : undefined;
            const nameTouched = formik.touched.subjects?.[index]?.name;
            const codeTouched = formik.touched.subjects?.[index]?.code;

            return (
              <div key={index} className="subject-row">
                <LeInput
                  id={`subjects.${index}.name`}
                  name={`subjects.${index}.name`}
                  label={
                    <div className="subject-name-label">
                      <span>Subject Name {index + 1}</span>
                      <button
                        type="button"
                        className="remove-row-btn-inline"
                        onClick={() => handleRemoveRow(index)}
                        disabled={formik.values.subjects.length <= 1}
                        aria-label="Remove subject"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  }
                  value={formik.values.subjects[index].name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={nameTouched && nameError ? nameError : undefined}
                  touched={!!nameTouched}
                  placeholder="e.g. Mathematics"
                  autoFocus={index === 0}
                />

                <LeInput
                  id={`subjects.${index}.code`}
                  name={`subjects.${index}.code`}
                  label={`Subject Code ${index + 1} (Optional)`}
                  value={formik.values.subjects[index].code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={codeTouched && codeError ? codeError : undefined}
                  touched={!!codeTouched}
                  placeholder="e.g. MTH 101"
                />
              </div>
            );
          })}
        </div>
        
        <hr className="form-divider" />

        <button type="button" className="add-row-btn" onClick={handleAddRow}>
          <Plus size={20} />
          Add Another Subject
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
            {isLoading ? 'Creating...' : 'Create Subjects'}
          </button>
        </div>
        <LeFormError message={errorMessage || ''} onClose={() => setErrorMessage(null)} />
      </form>
    </div>
  );
};

export default AddSubjectForm;
