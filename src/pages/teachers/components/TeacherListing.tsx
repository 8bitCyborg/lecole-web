import React, { useState } from 'react';
import { Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDeleteTeacherMutation } from '../../../services/leApi/teacherApi';
import DeleteConfirmationModal from '../../../components/ui/DeleteConfirmationModal/DeleteConfirmationModal';
import '../Teachers.css';

interface Teacher {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email?: string;
    phone: string;
  };
  staffId?: string;
  bio?: string;
  createdAt: string;
}

interface TeacherListingProps {
  teachers: Teacher[];
}

const TeacherListing: React.FC<TeacherListingProps> = ({ teachers }) => {
  const navigate = useNavigate();
  const [deleteTeacher] = useDeleteTeacherMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDeleteClick = (e: React.MouseEvent, teacher: any) => {
    e.stopPropagation();
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const handleViewClick = (teacher: any) => {
    navigate(`/teachers/${teacher.id}`);
  };

  const confirmDelete = async () => {
    if (teacherToDelete) {
      try {
        await deleteTeacher(teacherToDelete.id).unwrap();
        setShowDeleteModal(false);
        setTeacherToDelete(null);
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    }
  };

  return (
    <div className="teachers-table-container">
      <table className="teachers-table">
        <thead>
          <tr>
            <th>Teacher</th>
            {/* <th>Staff ID</th> */}
            <th>Phone</th>
            <th>Email</th>
            <th>Subjects</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id} onClick={() => handleViewClick(teacher)}>
              <td data-label="Teacher">
                <div className="teacher-name-cell">
                  <div className="teacher-avatar">
                    {getInitials(teacher.user.first_name, teacher.user.last_name)}
                  </div>
                  <div>
                    <div className="teacher-name">
                      {teacher.user.first_name} {teacher.user.last_name}
                    </div>
                    <div className="teacher-email">{teacher.user.email || 'No email provided'}</div>
                  </div>
                </div>
              </td>
              {/* <td data-label="Staff ID">
                <span className="staff-id-badge">{teacher.staffId || 'N/A'}</span>
              </td> */}
              <td data-label="Phone">{teacher.user.phone}</td>
              <td data-label="Email">{teacher.user.email}</td>
              <td data-label="Subjects"></td>
              <td data-label="Actions" style={{ textAlign: 'right' }}>
                <div className="teachers-actions">
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewClick(teacher);
                    }}
                    title="View Details"
                  >
                    <ChevronRight size={18} color="#00f" />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(e, teacher);
                    }}
                    title="Remove Teacher"
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
        title={`Remove Teacher: ${teacherToDelete?.user?.first_name} ${teacherToDelete?.user?.last_name}`}
        message={
          <>
            <p>Are you sure you want to remove this teacher? This will also delete their account and history.</p>
            <div className="delete-impact-notice">
              <p><strong>Impact:</strong></p>
              <ul>
                <li>The teacher will no longer be able to log in.</li>
                <li>All subject assignments for this teacher will be cleared.</li>
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

export default TeacherListing;
