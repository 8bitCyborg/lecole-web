import React, { useEffect, useState } from "react";
import SchoolDataForm from "./components/schoolDataForm";
import SchoolDetailsCard from "./components/SchoolDetailsCard";
import { useFindMySchoolQuery } from "../../services/leApi/schoolApi";
import { useDispatch, useSelector } from "react-redux";
import { setSchool } from "../../store/slices/schoolSlice";
import type { RootState } from "../../store";
import './SchoolOverview.css';

const School = () => {
  const { data: schoolData, isLoading, isError, refetch } = useFindMySchoolQuery();
  const dispatch = useDispatch();
  const school = useSelector((state: RootState) => state.school.school);
  const isLoaded = useSelector((state: RootState) => state.school.isLoaded);


  const formatValue = (val: string | null | undefined) => {
    if (!val) return 'N/A';
    return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  console.log('school', school);

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isError && !school) {
      setIsCreating(true);
    }
  }, [isError, school]);

  useEffect(() => {
    if (schoolData) {
      dispatch(setSchool(schoolData));
    }
  }, [schoolData, dispatch]);

  if (isLoading && !isLoaded) {
    return <div className="school-loading">Loading school info...</div>;
  }

  if (isCreating || (isError && !school)) {
    return <SchoolDataForm onSuccess={() => {
      setIsCreating(false);
      refetch();
    }} />;
  }

  return (
    <section className="school-overview-section">
      <div className="school-header-banner">
        <div className="school-header-content">
          <h1 className="school-name">{school?.name}</h1>
          <div className="school-header-meta">
            <span className="meta-item">{school?.address}, {school?.state}</span>
            {school?.email && (
              <span className="meta-item">{school?.email}</span>
            )}
            {school?.phone && (
              <span className="meta-item">{school?.phone}</span>
            )}
          </div>

          <div className="school-header-status">
            <div className="status-badge">
              <span className="status-value">{formatValue(school?.current_session) + ', ' + formatValue(school?.current_term)}</span>
            </div>
          </div>

          <button
            className="le-button le-button-outline edit-school-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : 'Edit School'}
          </button>
        </div>
      </div>

      <div className="school-details-container">
        {isEditing ? (
          <SchoolDataForm
            initialData={school}
            isEditMode={true}
            onSuccess={() => {
              setIsEditing(false);
              refetch();
            }}
          />
        ) : (
          <SchoolDetailsCard school={school} />
        )}
      </div>
    </section>
  );
};

export default School;