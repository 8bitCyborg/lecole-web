import React, { useState } from 'react';
import { Trash2, ChevronRight, UserCheck, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDeleteStaffMutation, useGetStaffQuery, useGetTeachingStaffQuery } from '../../../services/leApi/staffApi';
import type { Staff } from '../../../services/leApi/staffApi';
import DeleteConfirmationModal from '../../../components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import '../Staff.css';

interface StaffListingProps {
  onlyTeaching?: boolean;
}

const StaffListing: React.FC<StaffListingProps> = ({ onlyTeaching }) => {
  const navigate = useNavigate();
  
  // Use either the full staff query or the teaching-only one
  const allStaffResult = useGetStaffQuery(undefined, {
    skip: !!onlyTeaching,
    refetchOnMountOrArgChange: true,
  });
  
  const teachingStaffResult = useGetTeachingStaffQuery(undefined, {
    skip: !onlyTeaching,
    refetchOnMountOrArgChange: true,
  });

  const { data: staffData = [], isLoading } = onlyTeaching ? teachingStaffResult : allStaffResult;
  const staff = Array.isArray(staffData) ? staffData : Object.values(staffData);
  
  const [deleteStaff] = useDeleteStaffMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDeleteClick = (e: React.MouseEvent, staffMember: Staff) => {
    e.stopPropagation();
    setStaffToDelete(staffMember);
    setShowDeleteModal(true);
  };

  const handleViewClick = (staffMember: Staff) => {
    navigate(`/staff/${staffMember.id}`);
  };

  const confirmDelete = async () => {
    if (staffToDelete) {
      try {
        await deleteStaff(staffToDelete.id).unwrap();
        setShowDeleteModal(false);
        setStaffToDelete(null);
      } catch (error) {
        console.error('Failed to delete staff member:', error);
      }
    }
  };

  if (isLoading || staff.length === 0) return null;

  return (
    <div className="staff-table-container">
      <table className="staff-table">
        <thead>
          <tr>
            <th>Staff</th>
            <th>Category</th>
            <th>Designation</th>
            <th>Phone</th>
            <th>Email</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            <tr key={staffMember.id} onClick={() => handleViewClick(staffMember)}>
              <td data-label="Staff">
                <div className="staff-name-cell">
                  <div className="staff-avatar">
                    {getInitials(staffMember.user.firstName, staffMember.user.lastName)}
                  </div>
                  <div>
                    <div className="staff-name">
                      {staffMember.user.firstName} {staffMember.user.lastName}
                    </div>
                    <div className="staff-email">{staffMember.user.email || 'No email provided'}</div>
                  </div>
                </div>
              </td>
              <td data-label="Category">
                <div className={`staff-category-pill ${staffMember.isTeachingStaff ? 'teaching' : 'non-teaching'}`}>
                  {staffMember.isTeachingStaff ? <UserCheck size={14} /> : <UserX size={14} />}
                  <span>{staffMember.isTeachingStaff ? 'Teaching' : 'Non-Teaching'}</span>
                </div>
              </td>
              <td data-label="Designation">
                <span className="staff-designation-badge">{staffMember.designation}</span>
              </td>
              <td data-label="Phone">{staffMember.user.phone}</td>
              <td data-label="Email">{staffMember.user.email}</td>
              <td data-label="Actions" style={{ textAlign: 'right' }}>
                <div className="staff-actions">
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewClick(staffMember);
                    }}
                    title="View Details"
                  >
                    <ChevronRight size={18} color="#00f" />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(e, staffMember);
                    }}
                    title="Remove Staff Member"
                  >
                    <Trash2 size={18} color="#f00" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title={`Remove Staff Member: ${staffToDelete?.user?.firstName} ${staffToDelete?.user?.lastName}`}
        message={
          <>
            <p>Are you sure you want to remove this staff member? This will also delete their account and history.</p>
            <div className="delete-impact-notice">
              <p><strong>Impact:</strong></p>
              <ul>
                <li>The staff member will no longer be able to log in.</li>
                <li>All subject assignments for this staff member will be cleared.</li>
              </ul>
            </div>
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default StaffListing;
