import { useState, useMemo } from "react";
import { Layers, ChevronRight } from "lucide-react";
import { useGetSchoolArmsQuery } from "@/services/leApi/armsApi";
import Grades from "../components/Grades/index";
import "./Broadsheets.css";

const Broadsheets = () => {
  const { data: arms = [], isLoading } = useGetSchoolArmsQuery();
  const [selectedArmId, setSelectedArmId] = useState<string | null>(null);

  const selectedArm = useMemo(() => 
    arms.find(a => a.id === selectedArmId), 
  [arms, selectedArmId]);

  // Group arms by class name
  const groupedArms = useMemo(() => {
    const groups: Record<string, typeof arms> = {};
    arms.forEach(arm => {
      const className = arm.class?.name || "Other";
      if (!groups[className]) groups[className] = [];
      groups[className].push(arm);
    });

    // Sort classes and arms alphabetically
    return Object.keys(groups).sort().reduce((acc, className) => {
      acc[className] = groups[className].sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    }, {} as Record<string, typeof arms>);
  }, [arms]);

  if (isLoading) {
    return (
      <div className="broadsheets-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-dense">Synchronizing broadsheets...</div>
      </div>
    );
  }

  return (
    <div className="broadsheets-layout">
      {/* ── Sidebar ── */}
      <aside className="broadsheets-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Layers size={12} />
            <span>Select Arm</span>
          </div>
        </div>

        <div className="arms-list-scroll">
          {Object.entries(groupedArms).map(([className, classArms]) => (
            <div key={className} className="class-group">
              <div className="class-group-title">{className}</div>
              {classArms.map(arm => (
                <button
                  key={arm.id}
                  className={`arm-item-btn ${selectedArmId === arm.id ? 'active' : ''}`}
                  onClick={() => setSelectedArmId(arm.id)}
                >
                  <span className="arm-label">{arm.name}</span>
                  {selectedArmId === arm.id ? (
                    <div className="active-indicator" />
                  ) : (
                    <ChevronRight size={12} style={{ opacity: 0.2 }} />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main View ── */}
      <main className="broadsheets-main">
        {selectedArm ? (
          <Grades 
            key={selectedArm.id} 
            classId={selectedArm.classId} 
            armId={selectedArm.id} 
            isEmbedded
          />
        ) : (
          <div className="broadsheets-empty-state">
            <div className="selection-icon">📂</div>
            <h3 className="selection-title">Academic Records</h3>
            <p className="selection-desc">
              Please select a class arm from the sidebar to load the academic broadsheet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Broadsheets;