import React, { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import type { School } from '../../../../store/slices/schoolSlice';

interface SchoolDataFormProps {
  onSuccess?: () => void;
  initialData?: School | null;
  isEditMode?: boolean;
}

const SchoolDataForm: React.FC<SchoolDataFormProps> = ({ onSuccess, initialData, isEditMode = false }) => {
  const [step, setStep] = useState(1);
  const [schoolData, setSchoolData] = useState<School | null>(initialData || null);

  const handleStepOneSuccess = (school: School) => {
    setSchoolData(school);
    setStep(2);
  };

  const handleStepTwoSuccess = () => {
    onSuccess?.();
  };

  return (
    <>
      {step === 1 && (
        <StepOne 
          onSuccess={handleStepOneSuccess} 
          initialData={initialData} 
          isEditMode={isEditMode} 
        />
      )}
      {step === 2 && schoolData && (
        <StepTwo 
          onSuccess={handleStepTwoSuccess} 
          schoolData={schoolData} 
        />
      )}
    </>
  );
};

export default SchoolDataForm;
