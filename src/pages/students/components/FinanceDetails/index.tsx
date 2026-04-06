import React from 'react';
import { CreditCard, History, AlertCircle } from 'lucide-react';

interface StudentFinanceDetailsProps {
  student: any;
}

const StudentFinanceDetails: React.FC<StudentFinanceDetailsProps> = ({ student }) => {
  return (
    <div className="student-sections-container">
      <div className="detail-section">
        <h3 className="detail-section-title">Fee Summary</h3>
        <div className="le-profile-grid">
          <div className="le-detail-card">
            <div className="le-card-icon"><CreditCard size={24} /></div>
            <div className="le-card-info">
              <div className="le-card-label">Payment Status</div>
              <div className={`le-card-value ${student.isFeesPaid ? 'text-success' : 'text-danger'}`}>
                {student.isFeesPaid ? 'Fully Paid' : 'Outstanding Balance'}
              </div>
            </div>
          </div>
          
          <div className="le-detail-card">
            <div className="le-card-icon"><History size={24} /></div>
            <div className="le-card-info">
              <div className="le-card-label">Last Payment</div>
              <div className="le-card-value">N/A</div>
            </div>
          </div>

          {!student.isFeesPaid && (
            <div className="le-detail-card" style={{ gridColumn: 'span 3', background: '#fff7ed', borderColor: '#fdba74' }}>
              <div className="le-card-icon" style={{ color: '#ea580c' }}><AlertCircle size={24} /></div>
              <div className="le-card-info">
                <div className="le-card-label" style={{ color: '#9a3412' }}>Notice</div>
                <div className="le-card-value" style={{ color: '#7c2d12' }}>
                  Please ensure all outstanding balances are cleared to avoid academic disruption.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFinanceDetails;