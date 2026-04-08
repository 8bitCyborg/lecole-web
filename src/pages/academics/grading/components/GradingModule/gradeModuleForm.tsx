import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Save } from 'lucide-react';
import { 
  useCreateGradingModuleMutation, 
  useUpdateGradingModuleMutation,
} from '../../../../../services/leApi/gradingApi';
import type { 
  GradingModule,
  ModuleCategory 
} from '../../../../../services/leApi/gradingApi';
import { useGetSubjectsQuery } from '../../../../../services/leApi/subjectApi';

interface GradeModuleFormProps {
  onClose: () => void;
  initialData?: GradingModule;
}

const CATEGORIES: ModuleCategory[] = ['CA', 'EXAM', 'PRACTICAL', 'OTHER'];

const GradeModuleForm: React.FC<GradeModuleFormProps> = ({ onClose, initialData }) => {
  const [createModule, { isLoading: isCreating }] = useCreateGradingModuleMutation();
  const [updateModule, { isLoading: isUpdating }] = useUpdateGradingModuleMutation();
  const { data: subjects } = useGetSubjectsQuery();

  const isEdit = !!initialData;

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      weight: initialData?.weight || 0,
      category: initialData?.category || 'CA',
      sequence: initialData?.sequence || 0,
      subjectId: initialData?.subjectId || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      weight: Yup.number()
        .min(0, 'Min 0')
        .max(100, 'Max 100')
        .required('Required'),
      category: Yup.string().oneOf(CATEGORIES).required('Required'),
      sequence: Yup.number().min(0).optional(),
      subjectId: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          subjectId: values.subjectId === '' ? undefined : values.subjectId,
        };

        if (isEdit && initialData?.id) {
          await updateModule({ id: initialData.id, ...payload }).unwrap();
        } else {
          await createModule(payload).unwrap();
        }
        onClose();
      } catch (err) {
        console.error('Failed to save module:', err);
      }
    },
  });

  return (
    <div className="gradom-form-view">
      <div className="gradom-card-header" style={{ marginBottom: '1.5rem' }}>
        <div className="gradom-header-left">
          <h2 className="gradom-card-title">
            {isEdit ? 'Update Module' : 'Configure Grading Module'}
          </h2>
          <p className="gradom-card-subtitle">
            Configure how assessments are weighted for the current term and session.
          </p>
        </div>
        <button className="gradom-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="gradom-form">
        <div className="gradom-form-row">
          <div className="gradom-form-group mobile-row-1">
            <label htmlFor="name">Module Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Mid-term Assessment"
              className={`gradom-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="gradom-err-text">{formik.errors.name}</span>
            )}
          </div>
          
          <div className="gradom-form-group mobile-row-1-small">
            <label htmlFor="weight">Weight (%)</label>
            <input
              id="weight"
              type="number"
              className={`gradom-input ${formik.touched.weight && formik.errors.weight ? 'error' : ''}`}
              {...formik.getFieldProps('weight')}
            />
            {formik.touched.weight && formik.errors.weight && (
              <span className="gradom-err-text">{formik.errors.weight}</span>
            )}
          </div>

          <div className="gradom-form-group mobile-row-2">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="gradom-select-field"
              {...formik.getFieldProps('category')}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="gradom-form-group mobile-row-2">
            <label htmlFor="subjectId">Apply To</label>
            <select
              id="subjectId"
              className="gradom-select-field"
              {...formik.getFieldProps('subjectId')}
            >
              <option value="">All Subjects</option>
              {subjects?.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="gradom-actions mobile-full">
            <button 
              type="submit" 
              className="gradom-submit"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                'Saving...'
              ) : (
                <>
                  <Save size={18} />
                  {isEdit ? 'Save Changes' : 'Create Module'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GradeModuleForm;
