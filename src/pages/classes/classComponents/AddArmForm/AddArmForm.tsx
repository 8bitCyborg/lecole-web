import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Trash2, Plus } from 'lucide-react';
import { useUpdateArmMutation, useAssignMasterToArmMutation, useCreateBulkArmsMutation } from '@/services/leApi/armsApi';
import { useFindMySchoolQuery } from '@/services/leApi/schoolApi';
import { useGetStaffQuery } from '@/services/leApi/staffApi';
import LeInput from '@/components/ui/LeInput/LeInput';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import LeFormError from '@/components/ui/LeFormError/LeFormError';
import './AddArmForm.css';

interface AddArmFormProps {
  classId: string;
  armId?: string; // Required for edit
  initialValues?: {
    name: string;
    capacity?: number;
    classMasterId?: string | null;
  };
  isEdit?: boolean;
  onSuccess?: (values: { name: string; capacity?: number }[]) => void;
  onCancel?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

const ArmSchema = Yup.object().shape({
  arms: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Arm name is required').min(1, 'Name is too short'),
      capacity: Yup.number().positive('Capacity must be positive').optional().nullable(),
      classMasterId: Yup.string().optional().nullable(),
    })
  ).min(1, 'At least one arm is required'),
});

const AddArmForm: React.FC<AddArmFormProps> = ({
  classId,
  armId,
  initialValues,
  isEdit = false,
  onSuccess,
  onCancel,
  onLoadingChange
}) => {
  const school = useFindMySchoolQuery();
  const schoolData = school?.data;
  const [createBulkArms, { isLoading: isBulkCreating }] = useCreateBulkArmsMutation();
  const [updateArm, { isLoading: isUpdating }] = useUpdateArmMutation();
  const [assignMaster, { isLoading: isAssigning }] = useAssignMasterToArmMutation();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { data: allStaff = [] } = useGetStaffQuery();
  const teachers = allStaff.filter(s => s.isTeachingStaff);

  const teacherOptions = [
    { value: '', label: 'None Assigned' },
    ...teachers.map(t => ({
      value: t.id,
      label: `${t.user.firstName} ${t.user.lastName}`
    }))
  ];

  const isLoading = isBulkCreating || isUpdating || isAssigning;

  React.useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleSubmit = async (values: { arms: { name: string; capacity?: number | null; classMasterId?: string | null }[] }) => {
    if (!schoolData?.id || !classId) {
      console.error('Missing schoolId or classId');
      return;
    }

    try {
      if (isEdit && armId) {
        const singleArm = values.arms[0];
        await updateArm({
          classId,
          armId,
          name: singleArm.name,
          capacity: singleArm.capacity || undefined,
        }).unwrap();

        await assignMaster({ armId, staffId: singleArm.classMasterId || null }).unwrap();
        onSuccess?.([singleArm as any]);
      } else {
        // Bulk Creation
        await createBulkArms({
          arms: values.arms.map(a => ({
            name: a.name,
            capacity: a.capacity || undefined,
            classMasterId: a.classMasterId || undefined,
          })),
          classId,
          schoolId: schoolData.id,
        }).unwrap();

        onSuccess?.(values.arms as any);
      }
    } catch (err: any) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} arm:`, err);
      const msg = err?.data?.message || err?.message || 'An unexpected error occurred.';
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const formik = useFormik({
    initialValues: {
      arms: [{
        name: initialValues?.name || '',
        capacity: initialValues?.capacity || '' as any,
        classMasterId: initialValues?.classMasterId || '',
      }],
    },
    validationSchema: ArmSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  React.useEffect(() => {
    if (errorMessage) setErrorMessage(null);
  }, [formik.values]);

  const handleAddRow = () => {
    formik.setFieldValue('arms', [...formik.values.arms, { name: '', capacity: '' as any, classMasterId: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    const newArms = [...formik.values.arms];
    newArms.splice(index, 1);
    formik.setFieldValue('arms', newArms);
  };

  return (
    <div className="add-arm-form-container">
      <div className="form-header">
        <h2 className="form-title">{isEdit ? 'Update Class Arm' : 'Create Class Arms'}</h2>
        <p className="form-subtitle">
          {isEdit
            ? 'Modify the details for this class arm.'
            : 'Define new arms or sections for this class level at once.'}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-arm-form">
        <div className="arms-list">
          {formik.values.arms.map((_arm, index) => {
            const nameError = (formik.errors.arms?.[index] as any)?.name;
            const capacityError = (formik.errors.arms?.[index] as any)?.capacity;
            const classMasterError = (formik.errors.arms?.[index] as any)?.classMasterId;
            
            const nameTouched = formik.touched.arms?.[index]?.name;
            const capacityTouched = formik.touched.arms?.[index]?.capacity;
            const classMasterTouched = formik.touched.arms?.[index]?.classMasterId;

            return (
              <div key={index} className="arm-row">
                <LeInput
                  id={`arms.${index}.name`}
                  name={`arms.${index}.name`}
                  label={
                    <div className="arm-name-label">
                      <span>Arm Name {index + 1}</span>
                      {!isEdit && (
                        <button
                          type="button"
                          className="remove-row-btn-inline"
                          onClick={() => handleRemoveRow(index)}
                          disabled={formik.values.arms.length <= 1}
                          aria-label="Remove arm"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  }
                  value={formik.values.arms[index].name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={nameTouched && nameError ? nameError : undefined}
                  touched={!!nameTouched}
                  placeholder="e.g. A, Blue, Gold"
                  autoFocus={index === 0}
                />

                <div className="form-row">
                  <LeInput
                    id={`arms.${index}.capacity`}
                    name={`arms.${index}.capacity`}
                    label={`Maximum Capacity ${index + 1}`}
                    type="number"
                    value={formik.values.arms[index].capacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={capacityTouched && capacityError ? capacityError : undefined}
                    touched={!!capacityTouched}
                    placeholder="e.g. 40"
                  />

                  <LeDropdown
                    id={`arms.${index}.classMasterId`}
                    name={`arms.${index}.classMasterId`}
                    label={`Class Master ${index + 1}`}
                    options={teacherOptions}
                    value={formik.values.arms[index].classMasterId || ''}
                    onChange={formik.handleChange}
                    onBlur={() => formik.setFieldTouched(`arms.${index}.classMasterId`, true)}
                    error={classMasterTouched && classMasterError ? classMasterError : undefined}
                    touched={!!classMasterTouched}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {!isEdit && (
          <>
            <hr className="form-divider" />
            <button type="button" className="add-row-btn" onClick={handleAddRow}>
              <Plus size={20} />
              Add Another Arm
            </button>
          </>
        )}

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
            {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Arm' : 'Create Arms')}
          </button>
        </div>
        <LeFormError message={errorMessage || ''} onClose={() => setErrorMessage(null)} />
      </form>
    </div>
  );
};

export default AddArmForm;
