import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateArmMutation, useUpdateArmMutation, useAssignMasterToArmMutation } from '@/services/leApi/armsApi';
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
  onSuccess?: (values: { name: string; capacity?: number }) => void;
  onCancel?: () => void;
}

const ArmSchema = Yup.object().shape({
  name: Yup.string().required('Arm name is required').min(1, 'Name is too short'),
  capacity: Yup.number().positive('Capacity must be positive').optional().nullable(),
  classMasterId: Yup.string().optional().nullable(),
});

const AddArmForm: React.FC<AddArmFormProps> = ({
  classId,
  armId,
  initialValues,
  isEdit = false,
  onSuccess,
  onCancel
}) => {
  // const school = useSelector((state: RootState) => state.school.school);
  const school = useFindMySchoolQuery();
  const schoolData = school?.data
  const [createArm, { isLoading: isCreating }] = useCreateArmMutation();
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

  const isLoading = isCreating || isUpdating || isAssigning;

  const handleSubmit = async (values: { name: string; capacity?: number | null; classMasterId?: string | null }) => {
    if (!schoolData?.id || !classId) {
      console.error('Missing schoolId or classId');
      return;
    }

    try {
      let armResult: any;
      if (isEdit && armId) {
        armResult = await updateArm({
          classId,
          armId,
          name: values.name,
          capacity: values.capacity || undefined,
        }).unwrap();

        // Assign master if value changed or even if not, for simplicity in edit mode
        await assignMaster({ armId, staffId: values.classMasterId || null }).unwrap();
      } else {
        armResult = await createArm({
          name: values.name,
          capacity: values.capacity || undefined,
          classId: classId,
          schoolId: schoolData.id,
        }).unwrap();

        // Assign master after creation
        if (values.classMasterId) {
          await assignMaster({ armId: armResult.id, staffId: values.classMasterId }).unwrap();
        }
      }

      onSuccess?.({ name: values.name, capacity: values.capacity || undefined });
    } catch (err: any) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} arm:`, err);
      const msg = err?.data?.message || err?.message || 'An unexpected error occurred.';
      setErrorMessage(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || '',
      capacity: initialValues?.capacity || '' as any,
      classMasterId: initialValues?.classMasterId || '',
    },
    validationSchema: ArmSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  React.useEffect(() => {
    if (errorMessage) setErrorMessage(null);
  }, [formik.values]);

  return (
    <div className="add-arm-form-container">
      <div className="form-header">
        <h2 className="form-title">{isEdit ? 'Update Class Arm' : 'Create Class Arm'}</h2>
        <p className="form-subtitle">
          {isEdit
            ? 'Modify the details for this class arm.'
            : 'Define a new arm or section for this class level.'}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="add-arm-form">
        <div className="form-row">
          <LeInput
            id="name"
            label="Arm Name"
            {...formik.getFieldProps('name')}
            error={formik.errors.name as string}
            touched={!!formik.touched.name}
            placeholder="e.g. A, Blue, Gold"
            autoFocus
          />

          <LeInput
            id="capacity"
            label="Maximum Capacity"
            type="number"
            {...formik.getFieldProps('capacity')}
            error={formik.errors.capacity as string}
            touched={!!formik.touched.capacity}
            placeholder="e.g. 40"
          />
        </div>

        {/* <div className="form-row"> */}
        <LeDropdown
          id="classMasterId"
          label="Class Master"
          options={teacherOptions}
          {...formik.getFieldProps('classMasterId')}
          error={formik.errors.classMasterId as string}
          touched={!!formik.touched.classMasterId}
        />
        {/* </div> */}

        <div className="form-actions">
          <button
            type="button"
            className="le-button le-button-outline cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="le-button le-button-primary submit-btn"
            disabled={!formik.isValid || isLoading}
          >
            {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Arm' : 'Create Arm')}
          </button>
        </div>
        <LeFormError message={errorMessage || ''} onClose={() => setErrorMessage(null)} />
      </form>
    </div>
  );
};

export default AddArmForm;
