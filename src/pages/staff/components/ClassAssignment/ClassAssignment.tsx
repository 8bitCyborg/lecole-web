import React, { useMemo } from 'react';
import { Plus, X, Users, CheckCircle2 } from 'lucide-react';
import { useGetSchoolArmsQuery, useAssignMasterToArmMutation } from '@/services/leApi/classApi';
import type { Staff } from '@/services/leApi/staffApi';
import './ClassAssignment.css';

interface ClassAssignmentProps {
  staff: Staff;
}

const ClassAssignment: React.FC<ClassAssignmentProps> = ({ staff }) => {
  const { data: arms = [], isLoading } = useGetSchoolArmsQuery();
  const [assignMaster, { isLoading: isAssigning }] = useAssignMasterToArmMutation();

  const { groupedAvailable, groupedAssigned } = useMemo(() => {
    const availableGroups: Record<string, typeof arms> = {};
    const assignedGroups: Record<string, typeof arms> = {};

    arms.forEach(arm => {
      const className = arm.class?.name || 'Unknown Class';
      if (!arm.classMasterId) {
        if (!availableGroups[className]) availableGroups[className] = [];
        availableGroups[className].push(arm);
      } else if (arm.classMasterId === staff.id) {
        if (!assignedGroups[className]) assignedGroups[className] = [];
        assignedGroups[className].push(arm);
      }
    });

    const formatGroups = (groups: Record<string, typeof arms>) => 
      Object.keys(groups)
        .sort((a, b) => a.localeCompare(b))
        .map(className => ({
          className,
          arms: groups[className].sort((a, b) => a.name.localeCompare(b.name))
        }));

    return {
      groupedAvailable: formatGroups(availableGroups),
      groupedAssigned: formatGroups(assignedGroups)
    };
  }, [arms, staff.id]);

  const handleAssign = async (armId: string) => {
    try {
      await assignMaster({ armId, staffId: staff.id }).unwrap();
    } catch (err) {
      console.error('Failed to assign arm:', err);
    }
  };

  const handleUnassign = async (armId: string) => {
    try {
      await assignMaster({ armId, staffId: null }).unwrap();
    } catch (err) {
      console.error('Failed to unassign arm:', err);
    }
  };

  if (isLoading) {
    return <div className="ca-loading">Loading class assignments...</div>;
  }

  return (
    <div className="class-assignment-container">
      <div className="ca-section">
        <h4 className="ca-section-title">
          <CheckCircle2 size={16} className="ca-icon" /> 
          Assigned Arms
        </h4>
        {groupedAssigned.length === 0 ? (
          <p className="ca-empty-text">Not assigned to manage any class arms yet.</p>
        ) : (
          <div className="ca-groups">
            {groupedAssigned.map(group => (
              <div key={group.className} className="ca-group">
                <h5 className="ca-group-title">{group.className}</h5>
                <div className="ca-grid">
                  {group.arms.map(arm => (
                    <div key={arm.id} className="ca-card assigned">
                      <div className="ca-card-content">
                        <span className="ca-arm-name">{arm.name}</span>
                      </div>
                      <button 
                        className="ca-action-btn remove-btn" 
                        onClick={() => handleUnassign(arm.id)}
                        disabled={isAssigning}
                        title="Remove Assignment"
                      >
                        <X size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ca-section">
        <h4 className="ca-section-title">
          <Users size={16} className="ca-icon" /> 
          Available Arms
        </h4>
        <p className="ca-section-subtitle">Select an available arm to assign this staff member as the Class Master.</p>
        {groupedAvailable.length === 0 ? (
          <p className="ca-empty-text">No available arms at the moment. All arms have masters assigned.</p>
        ) : (
          <div className="ca-groups">
            {groupedAvailable.map(group => (
              <div key={group.className} className="ca-group">
                <h5 className="ca-group-title">{group.className}</h5>
                <div className="ca-grid">
                  {group.arms.map(arm => (
                    <div key={arm.id} className="ca-card available">
                      <div className="ca-card-content">
                        <span className="ca-arm-name">{arm.name}</span>
                      </div>
                      <button 
                        className="ca-action-btn add-btn" 
                        onClick={() => handleAssign(arm.id)}
                        disabled={isAssigning}
                        title="Assign as Master"
                      >
                        <Plus size={14} />
                        <span>Assign</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassAssignment;