import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { RootState } from '@/store';
import {
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useFindMySchoolQuery
} from '@/services/leApi/schoolApi';
import LeInput from '@/components/ui/LeInput/LeInput';
import LeDropdown from '@/components/ui/LeDropdown/LeDropdown';
import LeDatePicker from '@/components/ui/LeDatePicker/LeDatePicker';
import { Loader2 } from 'lucide-react';

import './style.css';

interface SchoolFormProps {
  isEditMode?: boolean;
  onEdit?: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const OWNERSHIP_OPTIONS = [
  { value: 'private', label: 'Private' },
  { value: 'mission', label: 'Mission' },
  { value: 'public', label: 'Public' },
];

const DataDisplay: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => (
  <div className="data-display-group">
    <div className="data-display-label">{label}</div>
    <div className="data-display-value">{value || '-'}</div>
  </div>
);

const SchoolSchema = Yup.object().shape({
  name: Yup.string().required('School Name is required'),
  shortname: Yup.string().optional(),
  email: Yup.string().email('Invalid email address').required('School Email is required'),
  phone: Yup.string().required('Phone Number is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  lga: Yup.string().optional(),
  ownershipType: Yup.string().required('Ownership type is required'),
  proprietor: Yup.string().optional(),
  website: Yup.string().url('Must be a valid URL').optional(),
  logo: Yup.string().url('Must be a valid URL').optional(),
  motto: Yup.string().optional(),
  dateOfInception: Yup.string().optional(),
});

const SchoolDetailsForm: React.FC<SchoolFormProps> = ({ onSuccess, onEdit, onCancel, isEditMode = false }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: school, isLoading: isFetching, refetch } = useFindMySchoolQuery();
  const [createSchool, { isLoading: isCreating }] = useCreateSchoolMutation();
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  const isSetup = !!school;

  const formik = useFormik({
    initialValues: {
      name: '',
      shortname: '',
      email: '',
      phone: '',
      address: '',
      state: '',
      lga: '',
      ownershipType: '',
      proprietor: '',
      website: '',
      logo: '',
      motto: '',
      dateOfInception: '',
    },
    validationSchema: SchoolSchema,
    onSubmit: async (values) => {
      try {
        const dateFormatted = values.dateOfInception ? new Date(values.dateOfInception).toISOString() : undefined;
        const payload = {
          ...values,
          shortname: values.shortname || undefined,
          lga: values.lga || undefined,
          proprietor: values.proprietor || undefined,
          website: values.website || undefined,
          logo: values.logo || undefined,
          motto: values.motto || undefined,
          dateOfInception: dateFormatted,
        };

        if (isEditMode && school) {
          await updateSchool({
            id: school.id,
            ...payload,
          }).unwrap();
        } else {
          if (!user?.id) return;
          await createSchool({
            userId: user.id,
            ...payload,
          }).unwrap();
        }

        refetch();
        onSuccess?.();
      } catch (err) {
        console.error('Failed to save school:', err);
      }
    },
  });

  useEffect(() => {
    if (school && isEditMode) {
      formik.setValues({
        name: school.name || '',
        shortname: school.shortname || '',
        email: school.email || '',
        phone: school.phone || '',
        address: school.address || '',
        state: school.state || '',
        lga: school.lga || '',
        ownershipType: school.ownershipType || '',
        proprietor: school.proprietor || '',
        website: school.website || '',
        logo: school.logo || '',
        motto: school.motto || '',
        dateOfInception: school.dateOfInception ? new Date(school.dateOfInception).toISOString().split('T')[0] : '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school, isEditMode]);

  const isSaving = isCreating || isUpdating;
  const isDisplayingForm = isEditMode || !isSetup;

  if (isFetching) {
    return (
      <div className="school-details-loading">
        <Loader2 className="animate-spin" size={24} />
        <span>Loading profile...</span>
      </div>
    );
  }

  const getHeaderContent = () => {
    if (!isSetup) {
      return {
        title: 'Setup School details',
        subtitle: 'Configure your school profile to get started with management features.',
        buttonLabel: 'Creating School...',
        showButton: false
      };
    }
    return {
      title: isEditMode ? 'Edit School Details' : 'School Profile',
      subtitle: isEditMode ? 'Update your basic info and branding details.' : 'Overview of your institution profile and configuration.',
      buttonLabel: isEditMode ? 'Cancel Editing' : 'Edit School Info',
      showButton: true
    };
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <div className="school-details-form-container">
      <div className="school-details-header">
        <div className="header-title-group">
          <h2 className="school-details-title">{title}</h2>
          <p className="school-details-subtitle">{subtitle}</p>
        </div>
        {isSetup && (
          <button
            type="button"
            className={`le-button ${isEditMode ? 'le-button-secondary' : 'le-button-primary'} edit-toggle-btn`}
            onClick={isEditMode ? onCancel : onEdit}
          >
            {isEditMode ? 'Cancel Editing' : 'Edit School Info'}
          </button>
        )}
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="form-section-label">General Info</div>
        <div className="form-grid-2-col">
          {isDisplayingForm ? (
            <LeInput
              id="name"
              label="School Name"
              {...formik.getFieldProps('name')}
              error={formik.errors.name as string}
              touched={formik.touched.name}
              placeholder="e.g. Lecole High School"
            />
          ) : (
            <DataDisplay label="School Name" value={school?.name} />
          )}

          {isDisplayingForm ? (
            <LeInput
              id="shortname"
              label="Shortname (Optional)"
              {...formik.getFieldProps('shortname')}
              error={formik.errors.shortname as string}
              touched={formik.touched.shortname}
              placeholder="e.g. Lecole"
            />
          ) : (
            <DataDisplay label="Shortname" value={school?.shortname} />
          )}
        </div>

        <div className="form-grid-2-col">
          {isDisplayingForm ? (
            <LeInput
              id="email"
              label="School Email"
              type="email"
              {...formik.getFieldProps('email')}
              error={formik.errors.email as string}
              touched={formik.touched.email}
              placeholder="contact@school.edu"
            />
          ) : (
            <DataDisplay label="School Email" value={school?.email} />
          )}

          {isDisplayingForm ? (
            <LeInput
              id="phone"
              label="School Phone Number"
              {...formik.getFieldProps('phone')}
              error={formik.errors.phone as string}
              touched={formik.touched.phone}
              placeholder="e.g. 08012345678"
            />
          ) : (
            <DataDisplay label="School Phone Number" value={school?.phone} />
          )}
        </div>

        <div className="form-section-label">Location</div>
        <div className="form-group-full">
          {isDisplayingForm ? (
            <LeInput
              id="address"
              label="Address"
              {...formik.getFieldProps('address')}
              error={formik.errors.address as string}
              touched={formik.touched.address}
              placeholder="Full physical address"
            />
          ) : (
            <DataDisplay label="Address" value={school?.address} />
          )}
        </div>

        <div className="form-grid-2-col">
          {isDisplayingForm ? (
            <LeInput
              id="state"
              label="State"
              {...formik.getFieldProps('state')}
              error={formik.errors.state as string}
              touched={formik.touched.state}
              placeholder="e.g. Lagos"
            />
          ) : (
            <DataDisplay label="State" value={school?.state} />
          )}

          {isDisplayingForm ? (
            <LeInput
              id="lga"
              label="LGA (Optional)"
              {...formik.getFieldProps('lga')}
              error={formik.errors.lga as string}
              touched={formik.touched.lga}
              placeholder="e.g. Ikeja"
            />
          ) : (
            <DataDisplay label="LGA" value={school?.lga} />
          )}
        </div>

        <div className="form-section-label">Branding & Ownership</div>
        <div className="form-grid-2-col">
          {isDisplayingForm ? (
            <LeDropdown
              id="ownershipType"
              label="Ownership Type"
              options={OWNERSHIP_OPTIONS}
              {...formik.getFieldProps('ownershipType')}
              error={formik.errors.ownershipType as string}
              touched={formik.touched.ownershipType}
              placeholder="Select ownership..."
            />
          ) : (
            <DataDisplay
              label="Ownership Type"
              value={OWNERSHIP_OPTIONS.find(opt => opt.value === school?.ownershipType)?.label || school?.ownershipType}
            />
          )}

          {isDisplayingForm ? (
            <LeInput
              id="proprietor"
              label="Proprietor (Optional)"
              {...formik.getFieldProps('proprietor')}
              error={formik.errors.proprietor as string}
              touched={formik.touched.proprietor}
              placeholder="e.g. Jane Doe"
            />
          ) : (
            <DataDisplay label="Proprietor" value={school?.proprietor} />
          )}
        </div>

        <div className="form-grid-2-col">
          {isDisplayingForm ? (
            <LeInput
              id="website"
              label="Website (Optional)"
              {...formik.getFieldProps('website')}
              error={formik.errors.website as string}
              touched={formik.touched.website}
              placeholder="https://..."
            />
          ) : (
            <DataDisplay label="Website" value={school?.website} />
          )}

          {isDisplayingForm ? (
            <LeDatePicker
              id="dateOfInception"
              label="Date of Inception (Optional)"
              {...formik.getFieldProps('dateOfInception')}
              error={formik.errors.dateOfInception as string}
              touched={formik.touched.dateOfInception}
            />
          ) : (
            <DataDisplay label="Date of Inception" value={school?.dateOfInception ? new Date(school.dateOfInception).toLocaleDateString() : undefined} />
          )}
        </div>

        <div className="form-grid-2-col">
          {isDisplayingForm ? (
            <LeInput
              id="logo"
              label="Logo URL (Optional)"
              {...formik.getFieldProps('logo')}
              error={formik.errors.logo as string}
              touched={formik.touched.logo}
              placeholder="https://..."
            />
          ) : (
            <DataDisplay label="Logo URL" value={school?.logo} />
          )}

          {isDisplayingForm ? (
            <LeInput
              id="motto"
              label="School Motto (Optional)"
              {...formik.getFieldProps('motto')}
              error={formik.errors.motto as string}
              touched={formik.touched.motto}
              placeholder="e.g. Excellence in all."
            />
          ) : (
            <DataDisplay label="School Motto" value={school?.motto} />
          )}
        </div>

        {isDisplayingForm && (
          <div className="form-actions-right">
            {isSetup && (
              <button
                type="button"
                className="le-button le-button-secondary"
                style={{ marginRight: '1rem', background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="le-button le-button-primary"
              disabled={isSaving || !formik.isValid}
            >
              {isSaving ? 'Saving...' : (isSetup ? 'Update Details' : 'Create School')}
            </button>
          </div>
        )}

      </form>
    </div>
  );
};

export default SchoolDetailsForm;
