import React from 'react';
import { UserCheck, Loader2, ChevronDown } from 'lucide-react';
import { useGetStaffQuery } from '@/services/leApi/staffApi';
import { useAssignMasterToArmMutation, useGetArmsQuery } from '@/services/leApi/armsApi';

interface ClassMasterProps {
  classId: string;
  armId: string;
}

const ClassMaster: React.FC<ClassMasterProps> = ({ classId, armId }) => {
  const { data: allStaff = [] } = useGetStaffQuery();
  const teachers = allStaff.filter(s => s.isTeachingStaff);
  const { data: arms = [] } = useGetArmsQuery(classId);
  const [assignMaster, { isLoading: isUpdating }] = useAssignMasterToArmMutation();

  const currentArm = arms.find(a => a.id === armId);
  const currentMasterId = currentArm?.classMasterId;
  const currentMaster = currentMasterId ? teachers.find(t => t.id === currentMasterId) : null;

  const handleAssign = async (staffId: string | null) => {
    try {
      await assignMaster({ armId, staffId }).unwrap();
    } catch (err) {
      console.error('Failed to assign class master:', err);
    }
  };

  return (
    <div className="banner-stat-item class-master-pill" style={{ position: 'relative', cursor: 'pointer' }}>
      {/* Hidden select overlay to trigger native picker on first click */}
      <select 
        className="stat-select-overlay"
        value={currentMasterId || ''}
        onChange={(e) => handleAssign(e.target.value || null)}
        title="Change Class Master"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          zIndex: 2
        }}
      >
        <option value="">None Assigned</option>
        {teachers.map(t => (
          <option key={t.id} value={t.id}>
            {t.user.firstName} {t.user.lastName}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1, position: 'relative', width: '100%' }}>
        {isUpdating ? (
          <Loader2 size={16} className="stat-icon animate-spin" />
        ) : (
          <UserCheck size={16} className="stat-icon" />
        )}
        
        <div className="stat-label-group" style={{ flex: 1 }}>
          <span className="stat-label">Class Master</span>
          <div className="stat-value-container" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="stat-value">
              {currentMaster ? `${currentMaster.user.firstName} ${currentMaster.user.lastName}` : 'None Assigned'}
            </span>
            <ChevronDown size={14} className="stat-action-chevron" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassMaster;
